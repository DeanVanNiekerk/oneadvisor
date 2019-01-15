using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using api.App.Authorization;
using OneAdvisor.Model.Directory.Interface;
using api.Controllers.Directory.UserAliases.Dto;
using OneAdvisor.Model.Common;
using api.App.Dtos;
using OneAdvisor.Model.Directory.Model.UserAlias;
using Microsoft.AspNetCore.Http;

namespace api.Controllers.Directory.UserAliases
{

    [ApiController]
    [Route("api/directory/userAliases")]
    public class UserAliasesController : BaseController
    {
        public UserAliasesController(IHttpContextAccessor contextAccessor, IMapper mapper, IUserAliasService userAliasService, IAuthService authService)
            : base(contextAccessor)
        {
            Mapper = mapper;
            UserAliasService = userAliasService;
            AuthService = authService;
        }

        private IMapper Mapper { get; }
        private IUserAliasService UserAliasService { get; }
        private IAuthService AuthService { get; }

        [HttpGet("")]
        [UseCaseAuthorize("dir_view_users")]
        public async Task<PagedItemsDto<UserAliasDto>> Index(string filters = null)
        {
            var scope = await AuthService.GetScope(UserId, Scope, IsSuperAdmin());

            var queryOptions = new UserAliasQueryOptions(scope, filters);
            var pagedItems = await UserAliasService.GetUserAliases(queryOptions);

            return Mapper.MapToPageItemsDto<UserAlias, UserAliasDto>(pagedItems);
        }

        [HttpGet("{userAliasId}")]
        [UseCaseAuthorize("dir_view_users")]
        public async Task<ActionResult<UserAliasDto>> Get(Guid userAliasId)
        {
            var scope = await AuthService.GetScope(UserId, Scope, IsSuperAdmin());

            var model = await UserAliasService.GetUserAlias(scope, userAliasId);

            if (model == null)
                return NotFound();

            return Ok(Mapper.Map<UserAliasDto>(model));
        }

        [HttpPost]
        [UseCaseAuthorize("dir_edit_users")]
        public async Task<ActionResult<Result>> Insert([FromBody] UserAliasDto userAlias)
        {
            var scope = await AuthService.GetScope(UserId, Scope, IsSuperAdmin());

            var model = Mapper.Map<UserAlias>(userAlias);

            var result = await UserAliasService.InsertUserAlias(scope, model);

            if (!result.Success)
                return BadRequest(result.ValidationFailures);

            return Ok(result);
        }

        [HttpPost("{userAliasId}")]
        [UseCaseAuthorize("dir_edit_users")]
        public async Task<ActionResult<Result>> Update(Guid userAliasId, [FromBody] UserAliasDto userAlias)
        {
            var scope = await AuthService.GetScope(UserId, Scope, IsSuperAdmin());

            userAlias.Id = userAliasId;

            var model = Mapper.Map<UserAlias>(userAlias);

            var result = await UserAliasService.UpdateUserAlias(scope, model);

            if (!result.Success)
                return BadRequest(result.ValidationFailures);

            return Ok(result);
        }
    }

}
