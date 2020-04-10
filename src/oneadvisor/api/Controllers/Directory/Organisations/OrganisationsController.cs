using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using api.App.Authorization;
using OneAdvisor.Model.Directory.Interface;
using OneAdvisor.Model.Directory.Model.Organisation;
using OneAdvisor.Model.Directory.Model.Role;
using OneAdvisor.Model.Account.Interface;
using Microsoft.AspNetCore.Authorization;
using System.Linq;
using OneAdvisor.Model.Storage.Model.Path.Directory;
using OneAdvisor.Model.Storage.Interface;
using OneAdvisor.Model.Common;

namespace api.Controllers.Directory.Organisations
{
    [ApiController]
    [Route("api/directory/organisations")]
    public class OrganisationsController : Controller
    {
        public OrganisationsController(
            IAuthenticationService authenticationService,
            IOrganisationService organisationService,
            IFileStorageService fileStorageService)
        {
            OrganisationService = organisationService;
            AuthenticationService = authenticationService;
            FileStorageService = fileStorageService;
        }

        private IOrganisationService OrganisationService { get; }
        private IAuthenticationService AuthenticationService { get; }
        private IFileStorageService FileStorageService { get; }

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

        [HttpPost("{organisationId}/config/logo")]
        [UseCaseAuthorize("dir_edit_organisations")]
        public async Task<IActionResult> UploadLogo(Guid organisationId)
        {
            var scope = AuthenticationService.GetScope(User);

            var model = await OrganisationService.GetOrganisation(scope, organisationId);

            if (model == null)
                return NotFound();

            var file = Request.Form.Files.FirstOrDefault();

            if (file == null)
                return BadRequest();

            using (var stream = file.OpenReadStream())
            {
                //Upload the file
                var path = new OrganisationLogoFilePath(organisationId, file.FileName); //file.FileName = stored as meta
                var fileName = await FileStorageService.AddFileAsync(path, stream);

                //Update the organisation
                model.Config.Storage.LogoStorageName = fileName;
            }

            return Ok(new Result(true));
        }

        [HttpGet("{organisationId}/config/logo")]
        public async Task<IActionResult> GetLogoFileInfo(Guid organisationId)
        {
            var scope = AuthenticationService.GetScope(User);

            var model = await OrganisationService.GetOrganisation(scope, organisationId);

            if (model == null || string.IsNullOrWhiteSpace(model.Config.Storage.LogoStorageName))
                return NotFound();

            var query = new OrganisationLogoFileQuery(scope.OrganisationId, model.Config.Storage.LogoStorageName);
            var file = await FileStorageService.GetFileInfoAsync(query);

            if (file == null)
                return NotFound();

            return Ok(file);
        }
    }

}
