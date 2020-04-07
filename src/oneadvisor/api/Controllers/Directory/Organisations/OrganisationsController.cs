using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using api.App.Authorization;
using OneAdvisor.Model.Directory.Interface;
using OneAdvisor.Model.Directory.Model.Organisation;
using OneAdvisor.Model.Directory.Model.Role;
using OneAdvisor.Model.Account.Interface;
using Microsoft.AspNetCore.Authorization;

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
        public async Task<IActionResult> Index(string filters = null)
        {
            var scope = AuthenticationService.GetScope(User, User.IsSuperAdmin());

            var queryOptions = new OrganisationQueryOptions(scope, filters);
            var pagedItems = await OrganisationService.GetOrganisations(queryOptions);

            return Ok(pagedItems);
        }

        [HttpGet("{organisationId}")]
        [Authorize]
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
        public async Task<IActionResult> Insert([FromBody] OrganisationEdit organisation)
        {
            var scope = AuthenticationService.GetScope(User, User.IsSuperAdmin());

            var result = await OrganisationService.InsertOrganisation(scope, organisation);

            if (!result.Success)
                return BadRequest(result.ValidationFailures);

            return Ok(result);
        }

        [HttpPost("{organisationId}")]
        [UseCaseAuthorize("dir_edit_organisations")]
        public async Task<IActionResult> Update(Guid organisationId, [FromBody] OrganisationEdit organisation)
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
