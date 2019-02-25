using OneAdvisor.Model.Common;
using OneAdvisor.Model.Account.Model.Authentication;

namespace OneAdvisor.Model.Directory.Model.User
{
    public class UserQueryOptions : QueryOptionsBase
    {
        public UserQueryOptions(ScopeOptions scope, int pageSize, int pageNumber)
         : base("LastName", "asc", pageSize, pageNumber)
        {
            Scope = scope;
        }

        public ScopeOptions Scope { get; set; }
    }
}