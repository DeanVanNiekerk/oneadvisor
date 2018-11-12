using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Controllers.Directory.Users.Dto;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OneAdvisor.Model.Directory.Interface;
using OneAdvisor.Model.Directory.Model.User;
using api.App.Authorization;
using OneAdvisor.Model.Common;

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
        public IEnumerable<UserInfoDto> Index()
        {
            return UserService.GetUsers().Result.Select(u => Mapper.Map<UserInfoDto>(u));
        }

        [UseCaseAuthorize("dir_view_users")]
        [HttpGet("{userId:string}")]
        public UserDto Get(string userId)
        {
            var model = UserService.GetUser(userId).Result;
            return Mapper.Map<UserDto>(model);
        }

        [UseCaseAuthorize("dir_edit_users")]
        [HttpPost("{userId:string}")]
        public async Task<Result> Update(string userId, [FromBody] UserDto user)
        {
            var model = Mapper.Map<User>(user);
            return await UserService.UpdateUser(model);
        }
    }

}
