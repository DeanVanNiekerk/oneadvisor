using OneAdvisor.Model.Common;
using OneAdvisor.Model.Account.Model.Authentication;

namespace OneAdvisor.Model.Directory.Model.Organisation
{
    public class OrganisationQueryOptions : QueryOptionsBase<Organisation>
    {
        public OrganisationQueryOptions(ScopeOptions scope)
         : base("Name", "asc", 0, 0)
        {
            Scope = scope;
        }

        public ScopeOptions Scope { get; set; }
    }
}