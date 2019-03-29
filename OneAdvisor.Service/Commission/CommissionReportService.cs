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
            FROM com_commission c
            JOIN com_CommissionStatement cs ON c.CommissionStatementId = cs.Id
            JOIN clt_Policy p ON c.PolicyId = p.Id
            JOIN clt_Client m ON p.ClientId = m.Id
            WHERE m.OrganisationId = '{organisationId}'
            {whereClause}
            GROUP BY m.Id";
        }

        private string GetClientRevenueQuery(DateTime endDate, Guid organisationId, string selectClause, string whereClause, string orderbyClause, string pagingClause)
        {
            return $@"
            WITH CommissionQuery AS 
            ( 
                SELECT
                
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

                FROM com_commission c
                    JOIN com_CommissionStatement cs ON c.CommissionStatementId = cs.Id
                    JOIN clt_Policy p ON c.PolicyId = p.Id
                    JOIN clt_Client m ON p.ClientId = m.Id
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
                    ((((AnnualAnnuity / 12) + MonthlyAnnuityMonth) * 12) + LifeFirstYears + OnceOff) AS 'GrandTotal'
                FROM CommissionQuery
            ),
            CommissionQueryNumbered AS 
            (
                SELECT *, Row_number() OVER({orderbyClause}) AS RowNumber
                FROM CommissionQueryTotaled
            ) 

            SELECT {selectClause}
            FROM CommissionQueryNumbered
            {pagingClause}
            ";
        }
    }
}