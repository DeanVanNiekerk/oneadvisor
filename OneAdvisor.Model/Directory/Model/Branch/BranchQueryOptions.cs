using System;
using OneAdvisor.Model.Common;
using OneAdvisor.Model.Directory.Model.Authentication;

namespace OneAdvisor.Model.Directory.Model.Branch
{
    public class BranchQueryOptions : QueryOptionsBase
    {
        public BranchQueryOptions(ScopeOptions scope, string filters = null)
         : base("Name", "asc", 0, 0, filters)
        {
            Scope = scope;

            var result = GetFilterValue<Guid>("OrganisationId");
            if (result.Success)
                OrganisationId = result.Value;
        }

        public ScopeOptions Scope { get; set; }
        public Guid? OrganisationId { get; set; }
    }
}