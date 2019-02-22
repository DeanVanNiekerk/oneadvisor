using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using OneAdvisor.Model.Common;
using OneAdvisor.Model.Directory.Model.Auth;
using OneAdvisor.Model.Directory.Model.User;

namespace OneAdvisor.Model.Directory.Interface
{
    public interface IUserServiceOkta
    {
        Task<PagedItems<User>> GetUsers(UserQueryOptions queryOptions);
        Task<UserEdit> GetUser(ScopeOptions scope, string id);
        Task<Result> UpdateUser(ScopeOptions scope, UserEdit user);
        Task<Result> InsertUser(ScopeOptions scope, UserEdit user);
        Task SyncAllUsers();
        Task<UserSimple> GetUserSimple(ScopeOptions scope, string id);
        Task<PagedItems<UserSimple>> GetUsersSimple(ScopeOptions scope);
    }
}
