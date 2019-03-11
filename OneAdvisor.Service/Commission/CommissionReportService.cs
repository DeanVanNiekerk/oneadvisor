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

namespace OneAdvisor.Service.Commission
{
    public class CommissionReportService : ICommissionReportService
    {
        private readonly DataContext _context;

        public CommissionReportService(DataContext context)
        {
            _context = context;
        }

        public async Task<PagedItems<MemberRevenueData>> GetMemberRevenueData(MemberRevenueQueryOptions options)
        {
            var lastMonth = DateTime.UtcNow.AddMonths(-1);

            var whereClause = "";
            if (options.Start.HasValue)
                whereClause += $" AND cs.Date >= '{options.Start.Value.ToString("yyyy-MM-dd")}' ";

            if (options.End.HasValue)
                whereClause += $" AND cs.Date <= '{options.End.Value.ToString("yyyy-MM-dd")}' ";

            var orderbyClause = "ORDER BY AnnualAnnuity DESC";
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

            var pagedItems = new PagedItems<MemberRevenueData>();

            var query = GetMemberRevenueQuery(lastMonth, options.Scope.OrganisationId, "COUNT(MemberId)", whereClause, orderbyClause);

            pagedItems.TotalItems = (await _context.FromSqlAsync<int>(query)).Single();

            query = GetMemberRevenueQuery(lastMonth, options.Scope.OrganisationId, "*", whereClause, orderbyClause, pagingClause);

            pagedItems.Items = await _context.FromSqlAsync<MemberRevenueData>(query);

            return pagedItems;
        }

        private string GetMemberRevenueQuery(DateTime lastMonth, Guid organisationId, string selectClause, string whereClause, string orderbyClause = "", string pagingClause = "")
        {
            return $@"
            WITH CommissionQuery AS 
            ( 
                SELECT
                
                    m.Id AS 'MemberId',
                    m.FirstName AS 'MemberFirstName',
                    m.LastName AS 'MemberLastName',

                    SUM(CASE WHEN 
                    ct.CommissionEarningsTypeId = '{CommissionEarningsType.EARNINGS_TYPE_ANNUAL_ANNUITY}' 
                    THEN c.amountIncludingVat ELSE 0 END) AS 'AnnualAnnuity',
                    SUM(CASE WHEN 
                    (cs.DateMonth = {lastMonth.Month} AND cs.DateYear = {lastMonth.Year} AND ct.CommissionEarningsTypeId = '{CommissionEarningsType.EARNINGS_TYPE_ANNUAL_ANNUITY}')
                    THEN c.amountIncludingVat ELSE 0 END) AS 'AnnualAnnuityMonth',

                    SUM(CASE WHEN 
                    ct.CommissionEarningsTypeId = '{CommissionEarningsType.EARNINGS_TYPE_MONTHLY_ANNUITY}' 
                    THEN c.AmountIncludingVAT ELSE 0 END) AS 'MonthlyAnnuity',
                    SUM(CASE WHEN 
                    (cs.DateMonth = {lastMonth.Month} AND cs.DateYear = {lastMonth.Year} AND ct.CommissionEarningsTypeId = '{CommissionEarningsType.EARNINGS_TYPE_MONTHLY_ANNUITY}')
                    THEN c.AmountIncludingVAT ELSE 0 END) AS 'MonthlyAnnuityMonth',

                    SUM(CASE WHEN 
                    ct.CommissionEarningsTypeId = '{CommissionEarningsType.EARNINGS_TYPE_ONCE_OFF}'
                    THEN c.AmountIncludingVAT ELSE 0 END) AS 'OnceOff',
                    SUM(CASE WHEN 
                    (cs.DateMonth = {lastMonth.Month} AND cs.DateYear = {lastMonth.Year} AND ct.CommissionEarningsTypeId = '{CommissionEarningsType.EARNINGS_TYPE_ONCE_OFF}')
                    THEN c.AmountIncludingVAT ELSE 0 END) AS 'OnceOffMonth',

                    SUM(CASE WHEN 
                    ct.CommissionEarningsTypeId = '{CommissionEarningsType.EARNINGS_TYPE_LIFE_FIRST_YEARS}'  
                    THEN c.AmountIncludingVAT ELSE 0 END) AS 'LifeFirstYears',
                    SUM(CASE WHEN 
                    (cs.DateMonth = {lastMonth.Month} AND cs.DateYear = {lastMonth.Year} AND ct.CommissionEarningsTypeId = '{CommissionEarningsType.EARNINGS_TYPE_LIFE_FIRST_YEARS}')
                    THEN c.AmountIncludingVAT ELSE 0 END) AS 'LifeFirstYearsMonth'

                FROM com_commission c
                    JOIN com_CommissionStatement cs ON c.CommissionStatementId = cs.Id
                    JOIN mem_Policy p ON c.PolicyId = p.Id
                    JOIN mem_Member m ON p.MemberId = m.Id
                    JOIN lkp_CommissionType ct ON c.CommissionTypeId = ct.id
                    JOIN lkp_CommissionEarningsType cet ON ct.CommissionEarningsTypeId = cet.Id
                WHERE cs.Processed = 1
                AND m.OrganisationId = '{organisationId}'
                {whereClause}
                GROUP BY m.id, m.firstName, m.lastName
               
            )
            ,CommissionQueryNumbered AS 
            (
                SELECT *, Row_number() OVER({orderbyClause}) AS RowNumber
                FROM CommissionQuery
            ) 

            SELECT {selectClause}
            FROM CommissionQueryNumbered
            {pagingClause}
            ";
        }
    }
}