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
using api.App.Authorization;

namespace api.Controllers.Directory.Users
{
    
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

        [UseCaseAuthorize("dir_view_users")]
        [HttpGet("[action]")]
        public IEnumerable<UserDto> Index()
        {
            return UserService.GetUsers().Result.Select(u => Mapper.Map<UserDto>(u));
        }
    }

}
