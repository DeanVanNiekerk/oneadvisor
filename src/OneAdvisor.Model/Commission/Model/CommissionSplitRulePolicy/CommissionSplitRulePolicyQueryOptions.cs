using System;
using System.Collections.Generic;
using OneAdvisor.Model.Common;
using OneAdvisor.Model.Account.Model.Authentication;

namespace OneAdvisor.Model.Commission.Model.CommissionSplitRulePolicy
{
    public class CommissionSplitRulePolicyQueryOptions : QueryOptionsBase<CommissionSplitRulePolicy>
    {
        public CommissionSplitRulePolicyQueryOptions(ScopeOptions scope, string sortColumn, string sortDirection, int pageSize, int pageNumber, string filters = null)
        : base(!string.IsNullOrWhiteSpace(sortColumn) ? sortColumn : "", !string.IsNullOrWhiteSpace(sortDirection) ? sortDirection : "asc", pageSize, pageNumber, filters)
        {
            Scope = scope;
        }

        public ScopeOptions Scope { get; set; }
    }
}