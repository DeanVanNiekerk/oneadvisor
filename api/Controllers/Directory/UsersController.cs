using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OneAdvisor.Model.Directory.Interface.Service;
using OneAdvisor.Model.Directory.Model.User;

namespace api.Controllers.Directory
{
    [Authorize]
    [ApiController]
    [Route("api/directory/users")]
    public class UsersController : Controller
    {
        public UsersController(IUserService userService)
        {
            UserService = userService;
        }

        private IUserService UserService { get; }

        [HttpGet("[action]")]
        public Task<IEnumerable<UserInfo>> Index()
        {
            return UserService.GetUsers();
        }
    }

}
