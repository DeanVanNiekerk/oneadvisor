using System;
using System.Collections.Generic;
using OneAdvisor.Model.Directory.Model.User;

namespace OneAdvisor.Model.Directory.Interface.Repository
{
    public interface IUserRepository
    {
        IEnumerable<User> GetUsers();
    }
}
