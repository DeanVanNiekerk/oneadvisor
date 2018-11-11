using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using OneAdvisor.Model.Directory.Model.User;

namespace OneAdvisor.Model.Directory.Interface
{
    public interface IUserService
    {
        Task<IEnumerable<UserInfo>> GetUsers();
    }
}
