using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using api.App.Authorization;
using OneAdvisor.Model.Directory.Interface;
using OneAdvisor.Model.Common;
using OneAdvisor.Model.Directory.Model.Organisation;
using api.App.Dtos;
using Microsoft.AspNetCore.Http;
using OneAdvisor.Model.Directory.Model.Role;
using OneAdvisor.Model.Account.Interface;

namespace api.Controllers.Directory.Organisations
{
    [ApiController]
    [Route("api/directory/organisations")]
    public class OrganisationsController : Controller
    {
        public OrganisationsController(IAuthenticationService authenticationService, IOrganisationService organisationService)
        {
            OrganisationService = organisationService;
            AuthenticationService = authenticationService;
        }

        private IOrganisationService OrganisationService { get; }
        private IAuthenticationService AuthenticationService { get; }

        [HttpGet("")]
        [UseCaseAuthorize("dir_view_organisations")]
        public async Task<IActionResult> Index()
        {
            var scope = AuthenticationService.GetScope(User, User.IsSuperAdmin());

            var queryOptions = new OrganisationQueryOptions(scope);
            var pagedItems = await OrganisationService.GetOrganisations(queryOptions);

            return Ok(pagedItems);
        }

        [HttpGet("{organisationId}")]
        [UseCaseAuthorize("dir_view_organisations")]
        public async Task<IActionResult> Get(Guid organisationId)
        {
            var scope = AuthenticationService.GetScope(User, User.IsSuperAdmin());

            var model = await OrganisationService.GetOrganisation(scope, organisationId);

            if (model == null)
                return NotFound();

            return Ok(model);
        }

        [HttpPost]
        [RoleAuthorize(Role.SUPER_ADMINISTRATOR_ROLE)]
        [UseCaseAuthorize("dir_edit_organisations")]
        public async Task<IActionResult> Insert([FromBody] Organisation organisation)
        {
            var scope = AuthenticationService.GetScope(User, User.IsSuperAdmin());

            var result = await OrganisationService.InsertOrganisation(scope, organisation);

            if (!result.Success)
                return BadRequest(result.ValidationFailures);

            return Ok(result);
        }

        [HttpPost("{organisationId}")]
        [UseCaseAuthorize("dir_edit_organisations")]
        public async Task<IActionResult> Update(Guid organisationId, [FromBody] Organisation organisation)
        {
            var scope = AuthenticationService.GetScope(User, User.IsSuperAdmin());

            organisation.Id = organisationId;

            var result = await OrganisationService.UpdateOrganisation(scope, organisation);

            if (!result.Success)
                return BadRequest(result.ValidationFailures);

            return Ok(result);
        }
    }

}
