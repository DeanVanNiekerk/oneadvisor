using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Controllers.Directory.Users.Dto;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OneAdvisor.Model.Directory.Interface.Service;
using OneAdvisor.Model.Directory.Model.User;

namespace api.Controllers.Directory.Users
{
    [Authorize]
    [ApiController]
    [Route("api/directory/users")]
    public class UsersController : Controller
    {
        public UsersController(IMapper mapper, IUserService userService)
        {
            Mapper = mapper;
            UserService = userService;
        }

        private IMapper Mapper { get; }
        private IUserService UserService { get; }

        [HttpGet("[action]")]
        public IEnumerable<UserDto> Index()
        {
            return UserService.GetUsers().Result.Select(u => Mapper.Map<UserDto>(u));
        }
    }

}
