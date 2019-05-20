using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using OneAdvisor.Model.Account.Model.Authentication;
using OneAdvisor.Model.Commission.Model.CommissionReport;
using OneAdvisor.Model.Common;
using OneAdvisor.Model.Directory.Model.User;

namespace OneAdvisor.Model.Commission.Interface
{
    public interface ICommissionReportService
    {
        Task<PagedItems<ClientRevenueData>> GetClientRevenueData(ClientRevenueQueryOptions options);
        Task<IEnumerable<UserEarningsTypeMonthlyCommissionData>> GetUserEarningsTypeMonthlyCommissionData(UserEarningsTypeMonthlyCommissionQueryOptions queryOptions);
        Task<IEnumerable<UserCompanyMonthlyCommissionData>> GetUserCompanyMonthlyCommissionData(UserCompanyMonthlyCommissionQueryOptions queryOptions);
    }
}