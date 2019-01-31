using System;
using System.Threading.Tasks;
using OneAdvisor.Model.Commission.Model.Commission;
using OneAdvisor.Model.Common;
using OneAdvisor.Model.Directory.Model.Auth;

namespace OneAdvisor.Model.Commission.Interface
{
    public interface ICommissionService
    {
        Task<PagedItems<Commission.Model.Commission.Commission>> GetCommissions(CommissionQueryOptions queryOptions);
        Task<CommissionEdit> GetCommission(ScopeOptions scope, Guid id);
        Task<Result> UpdateCommission(ScopeOptions scope, CommissionEdit commission);
        Task<Result> InsertCommission(ScopeOptions scope, CommissionEdit commission);
    }
}