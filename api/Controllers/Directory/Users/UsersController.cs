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
        public UsersController(IHttpContextAccessor contextAccessor, IMapper mapper, IUserService userService, IAuthService authService)
         : base(contextAccessor)
        {
            Mapper = mapper;
            UserService = userService;
            AuthService = authService;
        }

        private IMapper Mapper { get; }
        private IUserService UserService { get; }
        private IAuthService AuthService { get; }

        [HttpGet("")]
        [UseCaseAuthorize("dir_view_users")]
        public async Task<PagedItemsDto<UserDto>> Index(int pageNumber = 0, int pageSize = 0)
        {
            var queryOptions = new UserQueryOptions(pageNumber, pageSize);
            var pagedItems = await UserService.GetUsers(queryOptions);

            return Mapper.MapToPageItemsDto<User, UserDto>(pagedItems);
        }

        [HttpGet("{userId}")]
        [UseCaseAuthorize("dir_view_users")]
        public async Task<ActionResult<UserEditDto>> Get(string userId)
        {
            var model = await UserService.GetUser(userId);

            if (model == null)
                return NotFound();

            return Ok(Mapper.Map<UserEditDto>(model));
        }

        [HttpPost]
        [UseCaseAuthorize("dir_edit_users")]
        public async Task<ActionResult<Result>> Insert([FromBody] UserEditDto user)
        {
            var model = Mapper.Map<UserEdit>(user);

            var result = await UserService.InsertUser(model);

            if (!result.Success)
                return BadRequest(result.ValidationFailures);

            return Ok(result);
        }

        [HttpPost("{userId}")]
        [UseCaseAuthorize("dir_edit_users")]
        public async Task<ActionResult<Result>> Update(string userId, [FromBody] UserEditDto user)
        {
            user.Id = userId;

            var model = Mapper.Map<UserEdit>(user);

            var result = await UserService.UpdateUser(model);

            if (!result.Success)
                return BadRequest(result.ValidationFailures);

            return Ok(result);
        }

        [HttpPost("{userId}/sync")]
        [UseCaseAuthorize("dir_edit_users")]
        public async Task<ActionResult<Result>> Sync(string userId)
        {
            await UserService.SyncUser(userId);

            return Ok(new Result(true));
        }

        [HttpGet("simple")]
        [Authorize]
        public async Task<PagedItemsDto<UserSimpleDto>> GetUsersSimple(string userId)
        {
            var scope = await AuthService.GetScope(UserId, Scope);

            var pagedItems = await UserService.GetUsersSimple(scope);

            return Mapper.MapToPageItemsDto<UserSimple, UserSimpleDto>(pagedItems);
        }

        [HttpGet("simple/{userId}")]
        [Authorize]
        public async Task<ActionResult<UserSimpleDto>> GetUserSimple(string userId)
        {
            var scope = await AuthService.GetScope(UserId, Scope);

            var model = await UserService.GetUserSimple(scope, userId);

            if (model == null)
                return NotFound();

            return Ok(Mapper.Map<UserSimpleDto>(model));
        }
    }

}
