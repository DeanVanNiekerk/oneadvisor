using OneAdvisor.Model.Common;
using OneAdvisor.Model.Account.Model.Authentication;
using System;

namespace OneAdvisor.Model.Directory.Model.Organisation
{
    public class OrganisationQueryOptions : QueryOptionsBase<Organisation>
    {
        public OrganisationQueryOptions(ScopeOptions scope, string filters = null)
         : base("Name", "asc", 0, 0, filters)
        {
            Scope = scope;

            var resultGuid = GetFilterValue<Guid>("BranchId");
            if (resultGuid.Success)
                BranchId = resultGuid.Value;
        }

        public ScopeOptions Scope { get; set; }

        public Guid? BranchId { get; set; }
    }
}