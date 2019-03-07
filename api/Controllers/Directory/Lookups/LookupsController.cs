using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.App.Authorization;
using api.Controllers.Directory.Lookups.Dto;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OneAdvisor.Model.Common;
using OneAdvisor.Model.Directory.Interface;
using OneAdvisor.Model.Directory.Model.Lookup;

namespace api.Controllers.Directory.Lookups
{
    [ApiController]
    [Route("api/directory/lookups")]
    public class LookupsController : Controller
    {
        public LookupsController(ILookupService lookupService)
        {
            LookupService = lookupService;
        }

        private ILookupService LookupService { get; }

        [HttpGet("all")]
        public async Task<IActionResult> All()
        {
            var lookups = new api.Controllers.Directory.Lookups.Dto.Lookups()
            {
                Companies = await LookupService.GetCompanies(),
                CommissionTypes = await LookupService.GetCommissionTypes(),
                CommissionEarningsTypes = await LookupService.GetCommissionEarningsTypes(),
                PolicyTypes = await LookupService.GetPolicyTypes(),
                ContactTypes = await LookupService.GetContactTypes(),
                MarritalStatus = await LookupService.GetMarritalStatus(),
                CommissionStatementTemplateFieldNames = LookupService.GetCommissionStatementTemplateFieldNames(),
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
        [UseCaseAuthorize("dir_edit_lookups")]
        public async Task<IActionResult> InsertCompany([FromBody] Company model)
        {
            var result = await LookupService.InsertCompany(model);

            if (!result.Success)
                return BadRequest(result.ValidationFailures);

            return Ok(result);
        }

        [HttpPost("companies/{companyId}")]
        [UseCaseAuthorize("dir_edit_lookups")]
        public async Task<IActionResult> UpdateCompany(Guid companyId, [FromBody] Company model)
        {
            model.Id = companyId;

            var result = await LookupService.UpdateCompany(model);

            if (!result.Success)
                return BadRequest(result.ValidationFailures);

            return Ok(result);
        }

        #endregion

        #region Commission Types

        [HttpGet("commissionTypes")]
        public async Task<IActionResult> CommissionTypes()
        {
            var models = await LookupService.GetCommissionTypes();

            return Ok(models);
        }

        [HttpPost("commissionTypes")]
        [UseCaseAuthorize("dir_edit_lookups")]
        public async Task<IActionResult> InsertCommissionType([FromBody] CommissionType model)
        {
            var result = await LookupService.InsertCommissionType(model);

            if (!result.Success)
                return BadRequest(result.ValidationFailures);

            return Ok(result);
        }

        [HttpPost("commissionTypes/{commissionTypeId}")]
        [UseCaseAuthorize("dir_edit_lookups")]
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