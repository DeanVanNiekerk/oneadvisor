using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using OneAdvisor.Model.Account.Model.Authentication;
using OneAdvisor.Model.Client.Model.Policy;
using OneAdvisor.Model.Commission.Model.Commission;
using OneAdvisor.Model.Commission.Model.CommissionSplitRule;
using OneAdvisor.Model.Commission.Model.ImportCommission;
using OneAdvisor.Model.Common;

namespace OneAdvisor.Model.Commission.Interface
{
    public interface ICommissionSplitService
    {
        Task<PagedItems<CommissionSplitRule>> GetCommissionSplitRules(CommissionSplitRuleQueryOptions options);
        Task<CommissionSplitRule> GetCommissionSplitRule(ScopeOptions scope, Guid id);
        Task<Result> DeleteCommissionSplitRule(ScopeOptions scope, Guid id);
        Task<Result> UpdateCommissionSplitRule(ScopeOptions scope, CommissionSplitRule commissionSplitRule);
        Task<Result> InsertCommissionSplitRule(ScopeOptions scope, CommissionSplitRule commissionSplitRule);
        List<CommissionEdit> SplitCommission(CommissionEdit commission, Policy policy, ImportCommission sourceData, List<CommissionSplitRule> commissionSplitRule);
    }
}