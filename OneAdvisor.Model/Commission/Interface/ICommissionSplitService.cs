using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using OneAdvisor.Model.Account.Model.Authentication;
using OneAdvisor.Model.Commission.Model.CommissionSplitRule;
using OneAdvisor.Model.Common;

namespace OneAdvisor.Model.Commission.Interface
{
    public interface ICommissionSplitService
    {
        Task<PagedItems<CommissionSplitRule>> GetCommissionSplitRules(CommissionSplitRuleQueryOptions options);
        Task<CommissionSplitRule> GetCommissionSplitRule(ScopeOptions scope, Guid id);
        Task<Result> DeleteCommissionSplitRule(ScopeOptions scope, Guid id);
        Task<Result> UpdateCommissionSplitRule(ScopeOptions scope, CommissionSplitRule commissionAllocation);
        Task<Result> InsertCommissionSplitRule(ScopeOptions scope, CommissionSplitRule commissionAllocation);
    }
}