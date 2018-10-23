using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using OneAdvisor.Model.Directory.Model.User;

namespace OneAdvisor.Model.Directory.Interface.Repository
{
    public interface IUserRepository
    {
        Task<IEnumerable<UserInfo>> GetUsers();
    }
}
