using System;
using System.Threading.Tasks;
using api.App.Authorization;
using Microsoft.AspNetCore.Mvc;
using OneAdvisor.Model.Commission.Interface;
using OneAdvisor.Model.Commission.Model.Lookup;
using OneAdvisor.Model.Directory.Model.Role;

namespace api.Controllers.Commission.Lookups
{
    [ApiController]
    [Route("api/commission/lookups")]
    public class LookupsController : Controller
    {
        public LookupsController(ICommissionLookupService lookupService)
        {
            LookupService = lookupService;
        }

        private ICommissionLookupService LookupService { get; }

        [HttpGet("all")]
        public async Task<IActionResult> All()
        {
            var lookups = new api.Controllers.Commission.Lookups.Dto.Lookups()
            {
                CommissionTypes = await LookupService.GetCommissionTypes(),
                CommissionEarningsTypes = await LookupService.GetCommissionEarningsTypes(),
                CommissionStatementTemplateFieldNames = LookupService.GetCommissionStatementTemplateFieldNames(),
                CommissionStatementTemplateGroupFieldNames = LookupService.GetCommissionStatementTemplateGroupFieldNames(),
            };

            return Ok(lookups);
        }

        #region Commission Types

        [HttpGet("commissionTypes")]
        public async Task<IActionResult> CommissionTypes()
        {
            var models = await LookupService.GetCommissionTypes();

            return Ok(models);
        }

        [HttpPost("commissionTypes")]
        [RoleAuthorize(Role.SUPER_ADMINISTRATOR_ROLE)]
        public async Task<IActionResult> InsertCommissionType([FromBody] CommissionType model)
        {
            var result = await LookupService.InsertCommissionType(model);

            if (!result.Success)
                return BadRequest(result.ValidationFailures);

            return Ok(result);
        }

        [HttpPost("commissionTypes/{commissionTypeId}")]
        [RoleAuthorize(Role.SUPER_ADMINISTRATOR_ROLE)]
        public async Task<IActionResult> UpdateCommissionType(Guid commissionTypeId, [FromBody] CommissionType model)
        {
            var result = await LookupService.UpdateCommissionType(model);

            if (!result.Success)
                return BadRequest(result.ValidationFailures);

            return Ok(result);
        }

        #endregion
    }

}