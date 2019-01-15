using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using OneAdvisor.Model.Common;
using OneAdvisor.Model.Directory.Model.Auth;
using OneAdvisor.Model.Directory.Model.UserAlias;

namespace OneAdvisor.Model.Directory.Interface
{
    public interface IUserAliasService
    {
        Task<PagedItems<UserAlias>> GetUserAliases(UserAliasQueryOptions queryOptions);
        Task<UserAlias> GetUserAlias(ScopeOptions scope, Guid id);
        Task<Result> UpdateUserAlias(ScopeOptions scope, UserAlias alias);
        Task<Result> InsertUserAlias(ScopeOptions scope, UserAlias alias);
    }
}
