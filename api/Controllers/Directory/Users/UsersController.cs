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

        [HttpGet("")]
        [UseCaseAuthorize("dir_view_users")]
        public IEnumerable<UserDto> Index()
        {
            return UserService.GetUsers().Result.Select(u => Mapper.Map<UserDto>(u));
        }

        [HttpGet("{userId}")]
        [UseCaseAuthorize("dir_view_users")]
        public ActionResult<UserDto> Get(string userId)
        {
            var model = UserService.GetUser(userId).Result;

            if(model == null)
                return NotFound();

            return Ok(Mapper.Map<UserDto>(model));
        }

        [HttpPost]
        [UseCaseAuthorize("dir_edit_users")]
        public async Task<ActionResult<Result>> Insert([FromBody] UserDto user)
        {
            var model = Mapper.Map<User>(user);

            var result = await UserService.InsertUser(model);

            if(!result.Success)
                return BadRequest(result.ValidationFailures);

            return Ok(result);
        }

        [HttpPost("{userId}")]
        [UseCaseAuthorize("dir_edit_users")]
        public async Task<ActionResult<Result>> Update(string userId, [FromBody] UserDto user)
        {
            var model = Mapper.Map<User>(user);

            var result = await UserService.UpdateUser(model);

            if(!result.Success)
                return BadRequest(result.ValidationFailures);

            return Ok(result);
        }
    }

}
