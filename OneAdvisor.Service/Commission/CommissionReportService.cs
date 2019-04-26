using System;
using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;
using OneAdvisor.Data;
using OneAdvisor.Model.Commission.Interface;
using OneAdvisor.Model.Commission.Model.CommissionReport;
using OneAdvisor.Model.Directory.Model.User;
using Microsoft.EntityFrameworkCore;
using System.Data;
using System.Data.SqlClient;
using OneAdvisor.Model.Account.Model.Authentication;
using OneAdvisor.Model.Directory.Model.Lookup;
using OneAdvisor.Model.Common;
using OneAdvisor.Model;
using OneAdvisor.Model.Commission.Model.Lookup;

namespace OneAdvisor.Service.Commission
{
    public class CommissionReportService : ICommissionReportService
    {
        private readonly DataContext _context;

        public CommissionReportService(DataContext context)
        {
            _context = context;
        }

        public async Task<PagedItems<ClientRevenueData>> GetClientRevenueData(ClientRevenueQueryOptions options)
        {
            var date = new DateTime(options.YearEnding, options.MonthEnding, 1);
            var endDate = date.LastDayOfMonth();
            var startDate = endDate.AddYears(-1);

            var whereClause = $" AND cs.Date > '{startDate.ToString("yyyy-MM-dd")}' ";
            whereClause += $" AND cs.Date <= '{endDate.ToString("yyyy-MM-dd")}' ";

            if (!string.IsNullOrEmpty(options.ClientLastName))
                whereClause += $" AND m.LastName LIKE '{options.ClientLastName}'";

            var orderbyClause = "ORDER BY MonthlyAnnuityMonth DESC";
            if (!string.IsNullOrEmpty(options.SortOptions.Column))
            {
                var direction = options.SortOptions.Direction == SortDirection.Ascending ? "ASC" : "DESC";
                orderbyClause = $"ORDER BY {options.SortOptions.Column} {direction}";
            }

            var pagingClause = "";
            if (options.PageOptions.Size > 0)
            {
                var start = (options.PageOptions.Size * (options.PageOptions.Number - 1)) + 1;
                pagingClause = $"WHERE RowNumber BETWEEN {start} AND {start + options.PageOptions.Size - 1}";
            }

            var pagedItems = new PagedItems<ClientRevenueData>();

            var query = GetClientRevenueCountQuery(options.Scope.OrganisationId, whereClause);

            pagedItems.TotalItems = (await _context.FromSqlAsync<int>(query)).FirstOrDefault();

            query = GetClientRevenueQuery(endDate, options.Scope.OrganisationId, "*", whereClause, orderbyClause, pagingClause);

            pagedItems.Items = await _context.FromSqlAsync<ClientRevenueData>(query);

            return pagedItems;
        }

        private string GetClientRevenueCountQuery(Guid organisationId, string whereClause)
        {
            return $@"
            SELECT
                Distinct(Count(m.Id) OVER ())
            FROM clt_Client m
            LEFT JOIN com_CommissionAllocation ca on m.Id = ca.ToClientId
            JOIN clt_Policy p ON (m.Id = p.ClientId OR p.Id IN (SELECT value FROM OPENJSON(ca.PolicyIds)))
            JOIN com_commission c ON p.Id = c.PolicyId
            JOIN com_CommissionStatement cs ON c.CommissionStatementId = cs.Id 
            WHERE m.OrganisationId = '{organisationId}'
            {whereClause}
            GROUP BY m.Id";
        }

        private string GetClientRevenueQuery(DateTime endDate, Guid organisationId, string selectClause, string whereClause, string orderbyClause, string pagingClause)
        {
            var select = $@"
                    m.Id AS 'ClientId',
                    m.LastName AS 'ClientLastName',
                    m.Initials AS 'ClientInitials',
                    m.DateOfBirth AS 'ClientDateOfBirth',

                    SUM(CASE WHEN 
                    (cs.DateMonth = {endDate.Month} AND cs.DateYear = {endDate.Year} AND ct.CommissionEarningsTypeId = '{CommissionEarningsType.EARNINGS_TYPE_MONTHLY_ANNUITY}')
                    THEN c.AmountIncludingVAT ELSE 0 END) AS 'MonthlyAnnuityMonth',

                    SUM(CASE WHEN 
                    ct.CommissionEarningsTypeId = '{CommissionEarningsType.EARNINGS_TYPE_ANNUAL_ANNUITY}' 
                    THEN c.amountIncludingVat ELSE 0 END) AS 'AnnualAnnuity',

                    SUM(CASE WHEN 
                    ct.CommissionEarningsTypeId = '{CommissionEarningsType.EARNINGS_TYPE_ONCE_OFF}'
                    THEN c.AmountIncludingVAT ELSE 0 END) AS 'OnceOff',

                    SUM(CASE WHEN 
                    ct.CommissionEarningsTypeId = '{CommissionEarningsType.EARNINGS_TYPE_LIFE_FIRST_YEARS}'  
                    THEN c.AmountIncludingVAT ELSE 0 END) AS 'LifeFirstYears'
            ";

            return $@"
            WITH CommissionQuery AS 
            ( 
                SELECT
                
                    {select},
                    0 AS 'AllocationsCount'

                FROM clt_Client m
                JOIN clt_Policy p ON m.Id = p.ClientId
                JOIN com_commission c ON p.Id = c.PolicyId
                JOIN com_CommissionStatement cs ON c.CommissionStatementId = cs.Id 
                JOIN com_CommissionType ct ON c.CommissionTypeId = ct.id 
                JOIN com_CommissionEarningsType cet ON ct.CommissionEarningsTypeId = cet.Id
                WHERE m.OrganisationId = '{organisationId}'
                {whereClause}
                GROUP BY m.Id, m.LastName, m.Initials, m.DateOfBirth

                UNION

                SELECT
                
                    {select},
                    COUNT(*) AS 'AllocationsCount'

                FROM clt_Client m
                JOIN com_CommissionAllocation ca on m.Id = ca.ToClientId
                JOIN clt_Policy p ON p.Id IN (SELECT value FROM OPENJSON(ca.PolicyIds))
                JOIN com_commission c ON p.Id = c.PolicyId
                JOIN com_CommissionStatement cs ON c.CommissionStatementId = cs.Id 
                JOIN com_CommissionType ct ON c.CommissionTypeId = ct.id 
                JOIN com_CommissionEarningsType cet ON ct.CommissionEarningsTypeId = cet.Id
                WHERE m.OrganisationId = '{organisationId}'
                {whereClause}
                GROUP BY m.Id, m.LastName, m.Initials, m.DateOfBirth
            ),
            CommissionQueryTotaled
            AS
            (
                SELECT
                    ClientId,
                    ClientLastName,
                    ClientInitials,
                    ClientDateOfBirth,
                    MonthlyAnnuityMonth,
                    (AnnualAnnuity / 12) AS 'AnnualAnnuityAverage',
                    ((AnnualAnnuity / 12) + MonthlyAnnuityMonth) AS 'TotalMonthlyEarnings',
                    LifeFirstYears,
                    OnceOff,
                    ((((AnnualAnnuity / 12) + MonthlyAnnuityMonth) * 12) + LifeFirstYears + OnceOff) AS 'GrandTotal',
                    AllocationsCount
                FROM CommissionQuery
            ),
            CommissionQueryTotalGrouped
            AS
            (
                SELECT 
                ClientId, 
                ClientLastName, 
                ClientInitials, 
                ClientDateOfBirth, 
                SUM(MonthlyAnnuityMonth) AS 'MonthlyAnnuityMonth', 
                SUM(AnnualAnnuityAverage) AS 'AnnualAnnuityAverage', 
                SUM(TotalMonthlyEarnings) AS 'TotalMonthlyEarnings', 
                SUM(LifeFirstYears) AS 'LifeFirstYears', 
                SUM(OnceOff) AS 'OnceOff', 
                SUM(GrandTotal) AS 'GrandTotal',
                SUM(AllocationsCount) AS 'AllocationsCount' 
                FROM CommissionQueryTotaled
                GROUP BY ClientId, ClientLastName, ClientInitials, ClientDateOfBirth
            ),
            CommissionQueryNumbered AS 
            (
                SELECT *, Row_number() OVER({orderbyClause}) AS RowNumber
                FROM CommissionQueryTotalGrouped
            ) 

            SELECT {selectClause}
            FROM CommissionQueryNumbered
            {pagingClause}
            ";
        }
    }
}