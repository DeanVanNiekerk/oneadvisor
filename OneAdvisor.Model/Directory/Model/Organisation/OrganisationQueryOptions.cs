using OneAdvisor.Model.Common;
using OneAdvisor.Model.Directory.Model.Authentication;

namespace OneAdvisor.Model.Directory.Model.Organisation
{
    public class OrganisationQueryOptions : QueryOptionsBase
    {
        public OrganisationQueryOptions(ScopeOptions scope)
         : base("Name", "asc", 0, 0)
        {
            Scope = scope;
        }

        public ScopeOptions Scope { get; set; }
    }
}