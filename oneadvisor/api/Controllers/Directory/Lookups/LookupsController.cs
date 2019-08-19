using System;
using System.Threading.Tasks;
using api.App.Authorization;
using Microsoft.AspNetCore.Mvc;
using OneAdvisor.Model.Directory.Interface;
using OneAdvisor.Model.Directory.Model.Lookup;
using OneAdvisor.Model.Directory.Model.Role;

namespace api.Controllers.Directory.Lookups
{
    [ApiController]
    [Route("api/directory/lookups")]
    public class LookupsController : Controller
    {
        public LookupsController(IDirectoryLookupService lookupService)
        {
            LookupService = lookupService;
        }

        private IDirectoryLookupService LookupService { get; }

        [HttpGet("all")]
        public async Task<IActionResult> All()
        {
            var lookups = new api.Controllers.Directory.Lookups.Dto.Lookups()
            {
                Companies = await LookupService.GetCompanies(),
                UserTypes = await LookupService.GetUserTypes(),
            };

            return Ok(lookups);
        }

        #region Company

        [HttpGet("companies")]
        public async Task<IActionResult> Companies()
        {
            var models = await LookupService.GetCompanies();

            return Ok(models);
        }

        [HttpPost("companies")]
        [RoleAuthorize(Role.SUPER_ADMINISTRATOR_ROLE)]
        public async Task<IActionResult> InsertCompany([FromBody] Company model)
        {
            var result = await LookupService.InsertCompany(model);

            if (!result.Success)
                return BadRequest(result.ValidationFailures);

            return Ok(result);
        }

        [HttpPost("companies/{companyId}")]
        [RoleAuthorize(Role.SUPER_ADMINISTRATOR_ROLE)]
        public async Task<IActionResult> UpdateCompany(Guid companyId, [FromBody] Company model)
        {
            model.Id = companyId;

            var result = await LookupService.UpdateCompany(model);

            if (!result.Success)
                return BadRequest(result.ValidationFailures);

            return Ok(result);
        }

        #endregion
    }

}