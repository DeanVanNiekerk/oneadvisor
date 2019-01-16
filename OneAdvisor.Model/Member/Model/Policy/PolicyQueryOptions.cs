using System;
using OneAdvisor.Model.Common;
using OneAdvisor.Model.Directory.Model.Auth;

namespace OneAdvisor.Model.Member.Model.Policy
{
    public class PolicyQueryOptions : QueryOptionsBase
    {
        public PolicyQueryOptions(ScopeOptions scope, string sortColumn, string sortDirection, int pageSize, int pageNumber, string filters = null)
        : base(sortColumn, sortDirection, pageSize, pageNumber, filters)
        {
            Scope = scope;

            var result = GetFilterValue<Guid>("MemberId");
            if (result.Success)
                MemberId = result.Value;
        }

        public ScopeOptions Scope { get; set; }

        public Guid? MemberId { get; set; }
    }
}