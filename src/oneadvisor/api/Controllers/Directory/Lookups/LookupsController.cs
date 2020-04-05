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
            var getCompaniesTask = LookupService.GetCompanies();
            var getUserTypesTask = LookupService.GetUserTypes();
            var getAdviceScopesTask = LookupService.GetAdviceScopes();
            var getAdviceServicesTask = LookupService.GetAdviceServices();
            var getLicenseCategoriesTask = LookupService.GetLicenseCategories();

            //Run in parallel
            await Task.WhenAll(getCompaniesTask, getUserTypesTask, getAdviceScopesTask, getAdviceServicesTask, getLicenseCategoriesTask);

            var lookups = new api.Controllers.Directory.Lookups.Dto.Lookups()
            {
                Companies = await getCompaniesTask,
                UserTypes = await getUserTypesTask,
                AdviceScopes = await getAdviceScopesTask,
                AdviceServices = await getAdviceServicesTask,
                LicenseCategories = await getLicenseCategoriesTask,
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

        #region Advice Scopes

        [HttpGet("adviceScopes")]
        public async Task<IActionResult> AdviceScopes()
        {
            var models = await LookupService.GetAdviceScopes();

            return Ok(models);
        }

        [HttpPost("adviceScopes")]
        [RoleAuthorize(Role.SUPER_ADMINISTRATOR_ROLE)]
        public async Task<IActionResult> InsertAdviceScope([FromBody] AdviceScope model)
        {
            var result = await LookupService.InsertAdviceScope(model);

            if (!result.Success)
                return BadRequest(result.ValidationFailures);

            return Ok(result);
        }

        [HttpPost("adviceScopes/{adviceScopeId}")]
        [RoleAuthorize(Role.SUPER_ADMINISTRATOR_ROLE)]
        public async Task<IActionResult> UpdateAdviceScope(Guid adviceScopesId, [FromBody] AdviceScope model)
        {
            model.Id = adviceScopesId;

            var result = await LookupService.UpdateAdviceScope(model);

            if (!result.Success)
                return BadRequest(result.ValidationFailures);

            return Ok(result);
        }

        #endregion

        #region Advice Services

        [HttpGet("adviceServices")]
        public async Task<IActionResult> AdviceServices()
        {
            var models = await LookupService.GetAdviceServices();

            return Ok(models);
        }

        [HttpPost("adviceServices")]
        [RoleAuthorize(Role.SUPER_ADMINISTRATOR_ROLE)]
        public async Task<IActionResult> InsertAdviceService([FromBody] AdviceService model)
        {
            var result = await LookupService.InsertAdviceService(model);

            if (!result.Success)
                return BadRequest(result.ValidationFailures);

            return Ok(result);
        }

        [HttpPost("adviceServices/{adviceServiceId}")]
        [RoleAuthorize(Role.SUPER_ADMINISTRATOR_ROLE)]
        public async Task<IActionResult> UpdateAdviceService(Guid adviceServiceId, [FromBody] AdviceService model)
        {
            model.Id = adviceServiceId;

            var result = await LookupService.UpdateAdviceService(model);

            if (!result.Success)
                return BadRequest(result.ValidationFailures);

            return Ok(result);
        }

        #endregion

        #region License Category

        [HttpGet("licenseCategories")]
        public async Task<IActionResult> LicenseCategories()
        {
            var models = await LookupService.GetLicenseCategories();

            return Ok(models);
        }

        [HttpPost("licenseCategories")]
        [RoleAuthorize(Role.SUPER_ADMINISTRATOR_ROLE)]
        public async Task<IActionResult> InsertLicenseCategory([FromBody] LicenseCategory model)
        {
            var result = await LookupService.InsertLicenseCategory(model);

            if (!result.Success)
                return BadRequest(result.ValidationFailures);

            return Ok(result);
        }

        [HttpPost("licenseCategories/{licenseCategoryId}")]
        [RoleAuthorize(Role.SUPER_ADMINISTRATOR_ROLE)]
        public async Task<IActionResult> UpdateLicenseCategory(Guid licenseCategoryId, [FromBody] LicenseCategory model)
        {
            model.Id = licenseCategoryId;

            var result = await LookupService.UpdateLicenseCategory(model);

            if (!result.Success)
                return BadRequest(result.ValidationFailures);

            return Ok(result);
        }

        #endregion
    }

}