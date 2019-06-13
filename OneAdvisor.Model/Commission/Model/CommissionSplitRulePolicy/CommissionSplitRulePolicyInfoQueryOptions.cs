using System;
using System.Collections.Generic;
using OneAdvisor.Model.Common;
using OneAdvisor.Model.Account.Model.Authentication;

namespace OneAdvisor.Model.Commission.Model.CommissionSplitRulePolicy
{
    public class CommissionSplitRulePolicyInfoQueryOptions : QueryOptionsBase<CommissionSplitRulePolicyInfo>
    {
        public CommissionSplitRulePolicyInfoQueryOptions(ScopeOptions scope, string sortColumn, string sortDirection, int pageSize, int pageNumber, string filters = null)
        : base(!string.IsNullOrWhiteSpace(sortColumn) ? sortColumn : "", !string.IsNullOrWhiteSpace(sortDirection) ? sortDirection : "asc", pageSize, pageNumber, filters)
        {
            Scope = scope;
            PolicyUserId = new List<Guid>();

            var resultGuids = GetFilterValues<Guid>("PolicyUserId");
            if (resultGuids.Success)
                PolicyUserId = resultGuids.Value;
        }

        public ScopeOptions Scope { get; set; }

        public List<Guid> PolicyUserId { get; set; }
    }
}