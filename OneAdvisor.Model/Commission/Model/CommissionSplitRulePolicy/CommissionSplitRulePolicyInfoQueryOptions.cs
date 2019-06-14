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
            PolicyCompanyId = new List<Guid>();

            var result = GetFilterValue<string>("PolicyNumber");
            if (result.Success)
                PolicyNumber = result.Value;

            var resultGuids = GetFilterValues<Guid>("PolicyUserId");
            if (resultGuids.Success)
                PolicyUserId = resultGuids.Value;

            resultGuids = GetFilterValues<Guid>("PolicyCompanyId");
            if (resultGuids.Success)
                PolicyCompanyId = resultGuids.Value;
        }

        public ScopeOptions Scope { get; set; }

        public string PolicyNumber { get; set; }
        public List<Guid> PolicyUserId { get; set; }
        public List<Guid> PolicyCompanyId { get; set; }
    }
}