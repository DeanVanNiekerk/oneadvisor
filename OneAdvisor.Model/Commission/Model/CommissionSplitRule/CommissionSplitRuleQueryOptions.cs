using System;
using System.Collections.Generic;
using OneAdvisor.Model.Common;
using OneAdvisor.Model.Account.Model.Authentication;

namespace OneAdvisor.Model.Commission.Model.CommissionSplitRule
{
    public class CommissionSplitRuleQueryOptions : QueryOptionsBase<CommissionSplitRule>
    {
        public CommissionSplitRuleQueryOptions(ScopeOptions scope, string sortColumn, string sortDirection, int pageSize, int pageNumber, string filters = null)
        : base(!string.IsNullOrWhiteSpace(sortColumn) ? sortColumn : "Name", !string.IsNullOrWhiteSpace(sortDirection) ? sortDirection : "asc", pageSize, pageNumber, filters)
        {
            Scope = scope;
            UserId = new List<Guid>();

            var resultGuids = GetFilterValues<Guid>("UserId");
            if (resultGuids.Success)
                UserId = resultGuids.Value;
        }

        public ScopeOptions Scope { get; set; }

        public List<Guid> UserId { get; set; }
    }
}