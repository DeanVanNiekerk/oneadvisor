using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using api.App.Authorization;
using OneAdvisor.Model.Common;
using Microsoft.AspNetCore.Http;
using OneAdvisor.Model.Account.Interface;
using OneAdvisor.Model.Commission.Interface;
using OneAdvisor.Model.Commission.Model.CommissionAllocation;

namespace api.Controllers.Commission.CommissionAllocations
{

    [ApiController]
    [Route("api/commission/allocations")]
    public class CommissionAllocationsController : Controller
    {
        public CommissionAllocationsController(ICommissionAllocationService commissionAllocationService, IAuthenticationService authenticationService)
        {
            CommissionAllocationService = commissionAllocationService;
            AuthenticationService = authenticationService;
        }

        private ICommissionAllocationService CommissionAllocationService { get; }
        private IAuthenticationService AuthenticationService { get; }

        [HttpGet("")]
        [UseCaseAuthorize("com_view_commission_allocations")]
        public async Task<IActionResult> Index(string sortColumn, string sortDirection, int pageSize = 0, int pageNumber = 0, string filters = null)
        {
            var scope = AuthenticationService.GetScope(User);

            var queryOptions = new CommissionAllocationQueryOptions(scope, sortColumn, sortDirection, pageSize, pageNumber, filters);

            var commissions = await CommissionAllocationService.GetCommissionAllocations(queryOptions);

            return Ok(commissions);
        }

        [HttpGet("{commissionAllocationId}")]
        [UseCaseAuthorize("com_view_commission_allocations")]
        public async Task<IActionResult> Get(Guid commissionAllocationId)
        {
            var scope = AuthenticationService.GetScope(User);

            var model = await CommissionAllocationService.GetCommissionAllocation(scope, commissionAllocationId);

            if (model == null)
                return NotFound();

            return Ok(model);
        }

        [HttpPost]
        [UseCaseAuthorize("com_edit_commission_allocations")]
        public async Task<IActionResult> Insert([FromBody] CommissionAllocationEdit commissionAllocation)
        {
            var scope = AuthenticationService.GetScope(User);

            var result = await CommissionAllocationService.InsertCommissionAllocation(scope, commissionAllocation);

            if (!result.Success)
                return BadRequest(result.ValidationFailures);

            return Ok(result);
        }

        [HttpPost("{commissionAllocationId}")]
        [UseCaseAuthorize("com_edit_commission_allocations")]
        public async Task<IActionResult> Update(Guid commissionAllocationId, [FromBody] CommissionAllocationEdit commissionAllocation)
        {
            commissionAllocation.Id = commissionAllocationId;

            var scope = AuthenticationService.GetScope(User);

            var result = await CommissionAllocationService.UpdateCommissionAllocation(scope, commissionAllocation);

            if (!result.Success)
                return BadRequest(result.ValidationFailures);

            return Ok(result);
        }

        [HttpDelete("{commissionAllocationId}")]
        [UseCaseAuthorize("com_edit_commission_allocations")]
        public async Task<IActionResult> Delete(Guid commissionAllocationId)
        {
            var scope = AuthenticationService.GetScope(User);

            var result = await CommissionAllocationService.DeleteCommissionAllocation(scope, commissionAllocationId);

            if (!result.Success)
                return BadRequest(result.ValidationFailures);

            return Ok(result);
        }
    }

}
