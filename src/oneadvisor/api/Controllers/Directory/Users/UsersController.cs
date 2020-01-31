using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OneAdvisor.Model.Directory.Interface;
using OneAdvisor.Model.Directory.Model.User;
using api.App.Authorization;
using OneAdvisor.Model.Account.Interface;

namespace api.Controllers.Directory.Users
{
    [ApiController]
    [Route("api/directory/users")]
    public class UsersController : Controller
    {
        public UsersController(IUserService userService, IAuthenticationService authenticationService)
        {
            UserService = userService;
            AuthenticationService = authenticationService;
        }

        private IUserService UserService { get; }
        private IAuthenticationService AuthenticationService { get; }

        [HttpGet("")]
        [UseCaseAuthorize("dir_view_users")]
        public async Task<IActionResult> Index(int pageNumber = 0, int pageSize = 0)
        {
            var scope = AuthenticationService.GetScope(User, User.IsSuperAdmin());

            var queryOptions = new UserQueryOptions(scope, pageSize, pageNumber);
            var pagedItems = await UserService.GetUsers(queryOptions);

            return Ok(pagedItems);
        }

        [HttpGet("{userId}")]
        [UseCaseAuthorize("dir_view_users")]
        public async Task<IActionResult> Get(Guid userId)
        {
            var scope = AuthenticationService.GetScope(User, User.IsSuperAdmin());

            var model = await UserService.GetUser(scope, userId);

            if (model == null)
                return NotFound();

            return Ok(model);
        }

        [HttpPost]
        [UseCaseAuthorize("dir_edit_users")]
        public async Task<IActionResult> Insert([FromBody] UserEdit user)
        {
            var scope = AuthenticationService.GetScope(User, User.IsSuperAdmin());

            var result = await UserService.InsertUser(scope, user);

            if (!result.Success)
                return BadRequest(result.ValidationFailures);

            return Ok(result);
        }

        [HttpPost("{userId}")]
        [UseCaseAuthorize("dir_edit_users")]
        public async Task<IActionResult> Update(Guid userId, [FromBody] UserEdit user)
        {
            user.Id = userId;

            var scope = AuthenticationService.GetScope(User, User.IsSuperAdmin());

            var result = await UserService.UpdateUser(scope, user);

            if (!result.Success)
                return BadRequest(result.ValidationFailures);

            return Ok(result);
        }

        [HttpGet("simple")]
        [Authorize]
        public async Task<IActionResult> GetUsersSimple()
        {
            var scope = AuthenticationService.GetScope(User);

            var pagedItems = await UserService.GetUsersSimple(scope);

            return Ok(pagedItems);
        }

        [HttpGet("simple/{userId}")]
        [Authorize]
        public async Task<IActionResult> GetUserSimple(Guid userId)
        {
            var scope = AuthenticationService.GetScope(User);

            var model = await UserService.GetUserSimple(scope, userId);

            if (model == null)
                return NotFound();

            return Ok(model);
        }
    }
}
