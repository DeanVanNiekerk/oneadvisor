using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using OneAdvisor.Model.Account.Model.Authentication;
using OneAdvisor.Model.Common;
using OneAdvisor.Model.Directory.Model.User;

namespace OneAdvisor.Model.Directory.Interface
{
    public interface IUserService
    {
        Task<PagedItems<User>> GetUsers(UserQueryOptions queryOptions);
        Task<UserEdit> GetUser(ScopeOptions scope, Guid id);
        Task<UserEdit> GetUser(ScopeOptions scope, string userName);
        Task<Result> UpdateUser(ScopeOptions scope, UserEdit user);
        Task<Result> InsertUser(ScopeOptions scope, UserEdit user);
        Task<Result> InsertUser(ScopeOptions scope, UserEdit user, string password);
        Task<PagedItems<UserSimple>> GetUsersSimple(ScopeOptions scope);
        Task<UserSimple> GetUserSimple(ScopeOptions scope, Guid id);
    }
}
