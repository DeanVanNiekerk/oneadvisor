using System;
using System.Collections.Generic;
using OneAdvisor.Model.Directory.Model.User;

namespace OneAdvisor.Model.Directory.Interface.Service
{
    public class IUserService
    {
        IEnumerable<User> GetUsers();
    }
}
