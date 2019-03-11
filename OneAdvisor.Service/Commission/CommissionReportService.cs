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

namespace OneAdvisor.Service.Commission
{
    public class CommissionReportService : ICommissionReportService
    {
        private readonly DataContext _context;

        public CommissionReportService(DataContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<MemberRevenueData>> GetMemberRevenueData(ScopeOptions scope, DateTime start, DateTime end)
        {
            var lastMonth = DateTime.UtcNow.AddMonths(-1);

            return await _context.FromSqlAsync<MemberRevenueData>($@"
SELECT
    m.id AS 'MemberId',
    m.firstName AS 'MemberFirstName',
    m.lastName AS 'MemberLastName',

    SUM(CASE WHEN 
    ct.commissionEarningsTypeId = '{CommissionEarningsType.EARNINGS_TYPE_ANNUAL_ANNUITY}' 
    THEN c.amountIncludingVat ELSE 0 END) AS 'AnnualAnnuity',
    SUM(CASE WHEN 
    (MONTH(cs.date) = {lastMonth.Month} AND YEAR(cs.date) = {lastMonth.Year} AND ct.commissionEarningsTypeId = '{CommissionEarningsType.EARNINGS_TYPE_ANNUAL_ANNUITY}')
    THEN c.amountIncludingVat ELSE 0 END) AS 'AnnualAnnuityMonth',

    SUM(CASE WHEN 
    ct.commissionEarningsTypeId = '{CommissionEarningsType.EARNINGS_TYPE_MONTHLY_ANNUITY}' 
    THEN c.amountIncludingVat ELSE 0 END) AS 'MonthlyAnnuity',
    SUM(CASE WHEN 
    (MONTH(cs.date) = {lastMonth.Month} AND YEAR(cs.date) = {lastMonth.Year} AND ct.commissionEarningsTypeId = '{CommissionEarningsType.EARNINGS_TYPE_MONTHLY_ANNUITY}')
    THEN c.amountIncludingVat ELSE 0 END) AS 'MonthlyAnnuityMonth',

    SUM(CASE WHEN 
    ct.commissionEarningsTypeId = '{CommissionEarningsType.EARNINGS_TYPE_ONCE_OFF}'
    THEN c.amountIncludingVat ELSE 0 END) AS 'OnceOff',
    SUM(CASE WHEN 
    (MONTH(cs.date) = {lastMonth.Month} AND YEAR(cs.date) = {lastMonth.Year} AND ct.commissionEarningsTypeId = '{CommissionEarningsType.EARNINGS_TYPE_ONCE_OFF}')
    THEN c.amountIncludingVat ELSE 0 END) AS 'OnceOffMonth',

    SUM(CASE WHEN 
    ct.commissionEarningsTypeId = '{CommissionEarningsType.EARNINGS_TYPE_LIFE_FIRST_YEARS}'  
    THEN c.amountIncludingVat ELSE 0 END) AS 'LifeFirstYears',
    SUM(CASE WHEN 
    (MONTH(cs.date) = {lastMonth.Month} AND YEAR(cs.date) = {lastMonth.Year} AND ct.commissionEarningsTypeId = '{CommissionEarningsType.EARNINGS_TYPE_LIFE_FIRST_YEARS}')
    THEN c.amountIncludingVat ELSE 0 END) AS 'LifeFirstYearsMonth'

FROM com_commission c
    JOIN com_commissionStatement cs ON c.commissionStatementId = cs.id
    JOIN mem_policy p ON c.policyId = p.id
    JOIN mem_member m ON p.memberId = m.id
    JOIN lkp_commissionType ct ON c.commissionTypeId = ct.id
    JOIN lkp_commissionEarningsType cet ON ct.commissionEarningsTypeId = cet.id
WHERE cs.date >= '{start.ToString("yyyy-MM-dd")}'
AND cs.date <= '{end.ToString("yyyy-MM-dd")}'
GROUP BY m.id, m.firstName, m.lastName
            ");
        }
    }
}