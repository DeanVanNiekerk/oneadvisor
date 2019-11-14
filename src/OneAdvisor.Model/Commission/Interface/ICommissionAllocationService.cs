using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using OneAdvisor.Model.Account.Model.Authentication;
using OneAdvisor.Model.Commission.Model.CommissionAllocation;
using OneAdvisor.Model.Common;

namespace OneAdvisor.Model.Commission.Interface
{
    public interface ICommissionAllocationService
    {
        Task<PagedItems<CommissionAllocation>> GetCommissionAllocations(CommissionAllocationQueryOptions options);
        Task<CommissionAllocationEdit> GetCommissionAllocation(ScopeOptions scope, Guid id);
        Task<Result> DeleteCommissionAllocation(ScopeOptions scope, Guid commissionAllocationId);
        Task<Result> UpdateCommissionAllocation(ScopeOptions scope, CommissionAllocationEdit commissionAllocation);
        Task<Result> InsertCommissionAllocation(ScopeOptions scope, CommissionAllocationEdit commissionAllocation);
    }
}