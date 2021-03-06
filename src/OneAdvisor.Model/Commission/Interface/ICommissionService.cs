using System;
using System.Threading.Tasks;
using OneAdvisor.Model.Commission.Model.Commission;
using OneAdvisor.Model.Common;
using OneAdvisor.Model.Account.Model.Authentication;
using System.Collections.Generic;

namespace OneAdvisor.Model.Commission.Interface
{
    public interface ICommissionService
    {
        Task<PagedCommissions> GetCommissions(CommissionQueryOptions queryOptions);
        Task<CommissionEdit> GetCommission(ScopeOptions scope, Guid id);
        Task<Result> UpdateCommission(ScopeOptions scope, CommissionEdit commission);
        Task<Result> InsertCommission(ScopeOptions scope, CommissionEdit commission);
    }
}