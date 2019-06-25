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
using OneAdvisor.Service.Common.Query;

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

            var builder = GetClientRevenueCountQuery(options);

            pagedItems.TotalItems = (await _context.FromSqlAsync<int>(builder.Query, builder.SqlParameters)).FirstOrDefault();

            builder = GetClientRevenueQuery(options, "*", orderbyClause, pagingClause);

            pagedItems.Items = await _context.FromSqlAsync<ClientRevenueData>(builder.Query, builder.SqlParameters);

            return pagedItems;
        }

        private QueryBuilder GetClientRevenueCountQuery(ClientRevenueQueryOptions options)
        {
            var builder = new QueryBuilder();

            builder.Append($@"
            SELECT
                Distinct(Count(m.Id) OVER ())
            FROM clt_Client m
            JOIN clt_Policy p ON m.Id = p.ClientId
            JOIN com_commission c ON p.Id = c.PolicyId
            JOIN com_CommissionStatement cs ON c.CommissionStatementId = cs.Id");

            builder = AddBranchJoin(builder, options);

            builder.Append($@"
            WHERE m.OrganisationId = '{options.Scope.OrganisationId}'
            AND m.IsDeleted = 0");

            builder = AddBranchFilter(builder, options);
            builder = AddUserFilter(builder, options);
            builder = AddFilters(builder, options);

            builder.Append($@"GROUP BY m.Id");

            return builder;
        }

        private QueryBuilder AddBranchJoin(QueryBuilder builder, ClientRevenueQueryOptions options)
        {
            if (options.BranchId.Any())
            {
                builder.Append(@"
                JOIN idn_User u ON p.UserId = u.Id
                ");
            }
            return builder;
        }

        private QueryBuilder AddBranchFilter(QueryBuilder builder, ClientRevenueQueryOptions options, bool addSqlParameters = true)
        {
            if (options.BranchId.Any())
            {
                var parameters = new List<SqlParameter>();

                var index = 0;
                options.BranchId.ForEach(b =>
                {
                    parameters.Add(new SqlParameter($"@BranchId{index}", b.ToString()));
                    index++;
                });

                builder.Append($@"
                AND u.BranchId IN ({String.Join(',', parameters.Select(p => p.ParameterName))})");

                if (addSqlParameters)
                    builder.SqlParameters.AddRange(parameters);
            }
            return builder;
        }

        private QueryBuilder AddFilters(QueryBuilder builder, ClientRevenueQueryOptions options, bool addSqlParameters = true)
        {
            builder.Append("AND cs.Date > @StartDate");
            if (addSqlParameters)
                builder.SqlParameters.Add(new SqlParameter("@StartDate", options.StartDate));

            builder.Append("AND cs.Date <= @EndDate");
            if (addSqlParameters)
                builder.SqlParameters.Add(new SqlParameter("@EndDate", options.EndDate));

            if (!string.IsNullOrEmpty(options.ClientLastName))
            {
                builder.Append($"AND m.LastName LIKE @ClientLastName");
                if (addSqlParameters)
                    builder.SqlParameters.Add(new SqlParameter("@ClientLastName", options.ClientLastName));
            }

            return builder;
        }

        private QueryBuilder AddUserFilter(QueryBuilder builder, ClientRevenueQueryOptions options, bool addSqlParameters = true)
        {
            if (options.UserId.Any())
            {
                var parameters = new List<SqlParameter>();

                var index = 0;
                options.UserId.ForEach(u =>
                {
                    parameters.Add(new SqlParameter($"@User{index}", u.ToString()));
                    index++;
                });

                builder.Append($@"
                AND c.UserId IN ({String.Join(',', parameters.Select(p => p.ParameterName))})");

                if (addSqlParameters)
                    builder.SqlParameters.AddRange(parameters);
            }
            return builder;
        }

        private QueryBuilder GetClientRevenueQuery(ClientRevenueQueryOptions options, string selectClause, string orderbyClause, string pagingClause)
        {
            var builder = new QueryBuilder();

            var select = $@"
                    m.Id AS 'ClientId',
                    m.LastName AS 'ClientLastName',
                    m.Initials AS 'ClientInitials',
                    m.DateOfBirth AS 'ClientDateOfBirth',

                    SUM(CASE WHEN 
                    (cs.DateMonth = {options.EndDate.Month} AND cs.DateYear = {options.EndDate.Year} AND ct.CommissionEarningsTypeId = '{CommissionEarningsType.EARNINGS_TYPE_MONTHLY_ANNUITY}')
                    THEN (c.AmountIncludingVAT - c.VAT) ELSE 0 END) AS 'MonthlyAnnuityMonth',

                    SUM(CASE WHEN 
                    ct.CommissionEarningsTypeId = '{CommissionEarningsType.EARNINGS_TYPE_ANNUAL_ANNUITY}' 
                    THEN (c.AmountIncludingVAT - c.VAT) ELSE 0 END) AS 'AnnualAnnuity',

                    SUM(CASE WHEN 
                    ct.CommissionEarningsTypeId = '{CommissionEarningsType.EARNINGS_TYPE_ONCE_OFF}'
                    THEN (c.AmountIncludingVAT - c.VAT) ELSE 0 END) AS 'OnceOff',

                    SUM(CASE WHEN 
                    ct.CommissionEarningsTypeId = '{CommissionEarningsType.EARNINGS_TYPE_LIFE_FIRST_YEARS}'  
                    THEN (c.AmountIncludingVAT - c.VAT) ELSE 0 END) AS 'LifeFirstYears',

                    SUM(c.AmountIncludingVAT - c.VAT) AS 'GrandTotal'
            ";

            builder.Append($@"
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
                JOIN com_CommissionEarningsType cet ON ct.CommissionEarningsTypeId = cet.Id");

            builder = AddBranchJoin(builder, options);

            builder.Append($@"  
                WHERE m.OrganisationId = '{options.Scope.OrganisationId}'
                AND m.IsDeleted = 0");

            builder = AddBranchFilter(builder, options);
            builder = AddUserFilter(builder, options);
            builder = AddFilters(builder, options);

            builder.Append($@"     
                GROUP BY m.Id, m.LastName, m.Initials, m.DateOfBirth

                UNION

                SELECT
                
                    {select},
                    COUNT(*) AS 'AllocationsCount'

                FROM clt_Client m
                JOIN com_CommissionAllocation ca on m.Id = ca.ToClientId
                JOIN com_CommissionAllocationPolicy cap on ca.Id = cap.CommissionAllocationId
                JOIN clt_Policy p ON p.Id = cap.PolicyId
                JOIN com_commission c ON p.Id = c.PolicyId
                JOIN com_CommissionStatement cs ON c.CommissionStatementId = cs.Id 
                JOIN com_CommissionType ct ON c.CommissionTypeId = ct.id 
                JOIN com_CommissionEarningsType cet ON ct.CommissionEarningsTypeId = cet.Id");

            builder = AddBranchJoin(builder, options);

            builder.Append($@"  
                WHERE m.OrganisationId = '{options.Scope.OrganisationId}'
                AND m.IsDeleted = 0");

            builder = AddBranchFilter(builder, options, false);
            builder = AddUserFilter(builder, options, false);
            builder = AddFilters(builder, options, false);

            builder.Append($@"
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
                    GrandTotal,
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
            ");

            return builder;
        }

        public async Task<IEnumerable<UserEarningsTypeMonthlyCommissionData>> GetUserEarningsTypeMonthlyCommissionData(UserEarningsTypeMonthlyCommissionQueryOptions queryOptions)
        {
            var userQuery = ScopeQuery.GetUserEntityQuery(_context, queryOptions.Scope);

            var query = from commission in _context.Commission
                        join statement in _context.CommissionStatement
                            on commission.CommissionStatementId equals statement.Id
                        join commissionType in _context.CommissionType
                            on commission.CommissionTypeId equals commissionType.Id
                        join policy in _context.Policy
                            on commission.PolicyId equals policy.Id
                        join user in userQuery
                            on commission.UserId equals user.Id
                        select new
                        {
                            UserId = user.Id,
                            CompanyId = policy.CompanyId,
                            Date = statement.Date,
                            CommissionEarningsTypeId = commissionType.CommissionEarningsTypeId,
                            AmountIncludingVAT = commission.AmountIncludingVAT,
                            VAT = commission.VAT
                        };


            //Apply filters ----------------------------------------------------------------------------------------
            if (queryOptions.CompanyId.Any())
                query = query.Where(d => queryOptions.CompanyId.Contains(d.CompanyId));

            if (queryOptions.UserId.Any())
                query = query.Where(d => queryOptions.UserId.Contains(d.UserId));

            if (queryOptions.StartDate.HasValue)
                query = query.Where(d => queryOptions.StartDate.Value.Date <= d.Date);

            if (queryOptions.EndDate.HasValue)
                query = query.Where(d => queryOptions.EndDate.Value.Date >= d.Date);
            //------------------------------------------------------------------------------------------------------


            var groupQuery = from data in query
                             group new { data.AmountIncludingVAT, data.VAT } by new { data.CommissionEarningsTypeId } into g
                             select new UserEarningsTypeMonthlyCommissionData()
                             {
                                 CommissionEarningsTypeId = g.Key.CommissionEarningsTypeId,
                                 AmountExcludingVAT = g.Sum(c => (c.AmountIncludingVAT - c.VAT)),
                             };

            groupQuery = groupQuery.OrderBy(queryOptions.SortOptions.Column, queryOptions.SortOptions.Direction);

            return await groupQuery.ToListAsync();
        }

        public async Task<IEnumerable<UserCompanyMonthlyCommissionData>> GetUserCompanyMonthlyCommissionData(UserCompanyMonthlyCommissionQueryOptions queryOptions)
        {
            var userQuery = ScopeQuery.GetUserEntityQuery(_context, queryOptions.Scope);

            var query = from commission in _context.Commission
                        join statement in _context.CommissionStatement
                            on commission.CommissionStatementId equals statement.Id
                        join policy in _context.Policy
                            on commission.PolicyId equals policy.Id
                        join user in userQuery
                            on commission.UserId equals user.Id
                        select new
                        {
                            UserId = user.Id,
                            Date = statement.Date,
                            CompanyId = policy.CompanyId,
                            AmountIncludingVAT = commission.AmountIncludingVAT,
                            VAT = commission.VAT
                        };

            //Apply filters ----------------------------------------------------------------------------------------
            if (queryOptions.CompanyId.Any())
                query = query.Where(d => queryOptions.CompanyId.Contains(d.CompanyId));

            if (queryOptions.UserId.Any())
                query = query.Where(d => queryOptions.UserId.Contains(d.UserId));

            if (queryOptions.StartDate.HasValue)
                query = query.Where(d => queryOptions.StartDate.Value.Date <= d.Date);

            if (queryOptions.EndDate.HasValue)
                query = query.Where(d => queryOptions.EndDate.Value.Date >= d.Date);
            //------------------------------------------------------------------------------------------------------

            var groupQuery = from data in query
                             group new { data.AmountIncludingVAT, data.VAT } by new { data.CompanyId } into g
                             select new UserCompanyMonthlyCommissionData()
                             {
                                 CompanyId = g.Key.CompanyId,
                                 AmountExcludingVAT = g.Sum(c => (c.AmountIncludingVAT - c.VAT)),
                             };

            groupQuery = groupQuery.OrderBy(queryOptions.SortOptions.Column, queryOptions.SortOptions.Direction);

            return await groupQuery.ToListAsync();
        }
    }
}