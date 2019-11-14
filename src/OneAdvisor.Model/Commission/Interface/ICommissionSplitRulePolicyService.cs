using System;
using System.Threading.Tasks;
using OneAdvisor.Model.Account.Model.Authentication;
using OneAdvisor.Model.Commission.Model.CommissionSplitRulePolicy;
using OneAdvisor.Model.Common;

namespace OneAdvisor.Model.Commission.Interface
{
    public interface ICommissionSplitRulePolicyService
    {
        Task<PagedItems<CommissionSplitRulePolicyInfo>> GetCommissionSplitRulePolicyInfoList(CommissionSplitRulePolicyInfoQueryOptions options);
        Task<PagedItems<CommissionSplitRulePolicy>> GetCommissionSplitRulePolicies(CommissionSplitRulePolicyQueryOptions options);
        Task<CommissionSplitRulePolicy> GetCommissionSplitRulePolicy(ScopeOptions scope, Guid policyId);
        Task<Result> DeleteCommissionSplitRulePolicy(ScopeOptions scope, Guid id);
        Task<Result> UpdateCommissionSplitRulePolicy(ScopeOptions scope, CommissionSplitRulePolicy commissionSplitRulePolicy);
        Task<Result> InsertCommissionSplitRulePolicy(ScopeOptions scope, CommissionSplitRulePolicy commissionSplitRulePolicy);
    }
}