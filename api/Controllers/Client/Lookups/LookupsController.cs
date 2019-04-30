using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using api.App.Authorization;
using OneAdvisor.Model.Common;
using OneAdvisor.Model.Client.Interface;
using api.App.Dtos;
using Microsoft.AspNetCore.Http;
using OneAdvisor.Model.Directory.Interface;
using OneAdvisor.Model.Client.Model.Policy;
using OneAdvisor.Model.Client.Model.Contact;
using OneAdvisor.Model.Account.Interface;
using OneAdvisor.Model.Client.Model.Lookup;

namespace api.Controllers.Client.Contacts
{
    [ApiController]
    [Route("api/client/lookups")]
    public class LookupsController : Controller
    {
        public LookupsController(IClientLookupService lookupService)
        {
            LookupService = lookupService;
        }

        private IClientLookupService LookupService { get; }

        [HttpGet("all")]
        public async Task<IActionResult> All()
        {
            var lookups = new api.Controllers.Client.Lookups.Dto.Lookups()
            {
                PolicyTypes = await LookupService.GetPolicyTypes(),
                ClientTypes = await LookupService.GetClientTypes(),
                ContactTypes = await LookupService.GetContactTypes(),
                MarritalStatus = await LookupService.GetMarritalStatus(),
                PolicyProductTypes = await LookupService.GetPolicyProductTypes(),
                PolicyProducts = await LookupService.GetPolicyProducts(),
            };

            return Ok(lookups);
        }

        #region Policy Products

        [HttpGet("policyProducts")]
        public async Task<IActionResult> PolicyProducts()
        {
            var items = await LookupService.GetPolicyProducts();

            return Ok(items);
        }

        [HttpPost("policyProducts")]
        [UseCaseAuthorize("dir_edit_lookups")]
        public async Task<IActionResult> InsertPolicyProduct([FromBody] PolicyProduct policyProduct)
        {
            var result = await LookupService.InsertPolicyProduct(policyProduct);

            if (!result.Success)
                return BadRequest(result.ValidationFailures);

            return Ok(result);
        }

        [HttpPost("policyProducts/{policyProductId}")]
        [UseCaseAuthorize("dir_edit_lookups")]
        public async Task<IActionResult> UpdatePolicyProduct(Guid policyProductId, [FromBody] PolicyProduct policyProduct)
        {
            policyProduct.Id = policyProductId;

            var result = await LookupService.UpdatePolicyProduct(policyProduct);

            if (!result.Success)
                return BadRequest(result.ValidationFailures);

            return Ok(result);
        }

        #endregion

        #region Policy Product Types

        [HttpGet("policyProductTypes")]
        public async Task<IActionResult> PolicyProductTypes()
        {
            var items = await LookupService.GetPolicyProductTypes();

            return Ok(items);
        }

        [HttpPost("policyProductTypes")]
        [UseCaseAuthorize("dir_edit_lookups")]
        public async Task<IActionResult> InsertPolicyProductType([FromBody] PolicyProductType policyProductType)
        {
            var result = await LookupService.InsertPolicyProductType(policyProductType);

            if (!result.Success)
                return BadRequest(result.ValidationFailures);

            return Ok(result);
        }

        [HttpPost("policyProductTypes/{policyProductTypeId}")]
        [UseCaseAuthorize("dir_edit_lookups")]
        public async Task<IActionResult> UpdatePolicyProductType(Guid policyProductTypeId, [FromBody] PolicyProductType policyProductType)
        {
            policyProductType.Id = policyProductTypeId;

            var result = await LookupService.UpdatePolicyProductType(policyProductType);

            if (!result.Success)
                return BadRequest(result.ValidationFailures);

            return Ok(result);
        }

        #endregion
    }

}
