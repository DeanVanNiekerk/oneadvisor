using System;
using OneAdvisor.Model.Common;
using OneAdvisor.Model.Directory.Model.Auth;

namespace OneAdvisor.Model.Directory.Model.UserAlias
{
    public class UserAliasQueryOptions : QueryOptionsBase
    {
        public UserAliasQueryOptions(ScopeOptions scope, string filters = null)
         : base("Name", "desc", 0, 0, filters)
        {
            Scope = scope;

            var result = GetFilterValue<string>("UserId");
            if (result.Success)
                UserId = result.Value;
        }

        public ScopeOptions Scope { get; set; }

        public string UserId { get; set; }
    }
}