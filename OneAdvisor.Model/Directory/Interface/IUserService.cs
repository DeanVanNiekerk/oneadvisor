using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using OneAdvisor.Model.Common;
using OneAdvisor.Model.Directory.Model.User;

namespace OneAdvisor.Model.Directory.Interface
{
    public interface IUserService
    {
        Task<PagedItems<User>> GetUsers(UserQueryOptions queryOptions);
        Task<UserEdit> GetUser(string id);
        Task<Result> UpdateUser(UserEdit user);
        Task<Result> InsertUser(UserEdit user);
        Task SyncUser(string userId);
        Task<UserSimple> GetUserSimple(string id);
    }
}
