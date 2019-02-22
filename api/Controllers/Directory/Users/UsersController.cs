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
using api.App.Dtos;
using Microsoft.AspNetCore.Http;

namespace api.Controllers.Directory.Users
{
    [ApiController]
    [Route("api/directory/users")]
    public class UsersController : BaseController
    {
        public UsersController(IHttpContextAccessor contextAccessor, IMapper mapper, IUserService userService, IAuthenticationService authenticationService)
         : base(contextAccessor)
        {
            Mapper = mapper;
            UserService = userService;
            AuthenticationService = authenticationService;
        }

        private IMapper Mapper { get; }
        private IUserService UserService { get; }
        private IAuthenticationService AuthenticationService { get; }

        [HttpGet("")]
        [UseCaseAuthorize("dir_view_users")]
        public async Task<PagedItemsDto<UserDto>> Index(int pageNumber = 0, int pageSize = 0)
        {
            var scope = await AuthenticationService.GetScope(UserId, IsSuperAdmin);

            var queryOptions = new UserQueryOptions(scope, pageNumber, pageSize);
            var pagedItems = await UserService.GetUsers(queryOptions);

            return Mapper.MapToPageItemsDto<User, UserDto>(pagedItems);
        }

        [HttpGet("{userId}")]
        [UseCaseAuthorize("dir_view_users")]
        public async Task<ActionResult<UserEditDto>> Get(string userId)
        {
            var scope = await AuthenticationService.GetScope(UserId, IsSuperAdmin);

            var model = await UserService.GetUser(scope, userId);

            if (model == null)
                return NotFound();

            return Ok(Mapper.Map<UserEditDto>(model));
        }

        [HttpPost]
        [UseCaseAuthorize("dir_edit_users")]
        public async Task<ActionResult<Result>> Insert([FromBody] UserEditDto user)
        {
            var scope = await AuthenticationService.GetScope(UserId, IsSuperAdmin);

            var model = Mapper.Map<UserEdit>(user);

            var result = await UserService.InsertUser(scope, model);

            if (!result.Success)
                return BadRequest(result.ValidationFailures);

            return Ok(result);
        }

        [HttpPost("{userId}")]
        [UseCaseAuthorize("dir_edit_users")]
        public async Task<ActionResult<Result>> Update(string userId, [FromBody] UserEditDto user)
        {
            var scope = await AuthenticationService.GetScope(UserId, IsSuperAdmin);

            user.Id = userId;

            var model = Mapper.Map<UserEdit>(user);

            var result = await UserService.UpdateUser(scope, model);

            if (!result.Success)
                return BadRequest(result.ValidationFailures);

            return Ok(result);
        }
    }
}
