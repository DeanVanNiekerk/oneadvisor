using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using OneAdvisor.Model.Account.Model.Authentication;
using OneAdvisor.Model.Commission.Model.CommissionReport;
using OneAdvisor.Model.Directory.Model.User;

namespace OneAdvisor.Model.Commission.Interface
{
    public interface ICommissionReportService
    {
        Task<IEnumerable<MemberRevenueData>> GetMemberRevenueData(ScopeOptions scope, DateTime start, DateTime end);
    }
}