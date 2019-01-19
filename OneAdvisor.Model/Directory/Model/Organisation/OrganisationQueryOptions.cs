using OneAdvisor.Model.Common;
using OneAdvisor.Model.Directory.Model.Auth;

namespace OneAdvisor.Model.Directory.Model.Organisation
{
    public class OrganisationQueryOptions : QueryOptionsBase
    {
        public OrganisationQueryOptions(ScopeOptions scope)
         : base("Name", "desc", 0, 0)
        {
            Scope = scope;
        }

        public ScopeOptions Scope { get; set; }
    }
}