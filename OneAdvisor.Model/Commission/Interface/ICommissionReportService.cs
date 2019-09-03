using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using OneAdvisor.Model.Commission.Model.CommissionReport;
using OneAdvisor.Model.Common;

namespace OneAdvisor.Model.Commission.Interface
{
    public interface ICommissionReportService
    {
        Task<PagedItems<ClientRevenueData>> GetClientRevenueData(ClientRevenueQueryOptions options);
        Task<IEnumerable<UserEarningsTypeMonthlyCommissionData>> GetUserEarningsTypeMonthlyCommissionData(UserEarningsTypeMonthlyCommissionQueryOptions queryOptions);
        Task<IEnumerable<UserCompanyMonthlyCommissionData>> GetUserCompanyMonthlyCommissionData(UserCompanyMonthlyCommissionQueryOptions queryOptions);
        Task<IEnumerable<PastRevenueCommissionData>> GetPastRevenueCommissionData(PastRevenueCommissionQueryOptions queryOptions);
        Task<PagedItems<CommissionLapseData>> GetCommissionLapseData(CommissionLapseQueryOptions queryOptions);
    }
}