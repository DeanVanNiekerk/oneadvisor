using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using api.App.Authorization;
using OneAdvisor.Model.Common;
using api.App.Dtos;
using Microsoft.AspNetCore.Http;
using OneAdvisor.Model.Commission.Model.Commission;
using OneAdvisor.Model.Commission.Interface;
using OneAdvisor.Model.Directory.Interface;
using OneAdvisor.Model.Account.Interface;

namespace api.Controllers.Commission.Commissions
{

    [ApiController]
    [Route("api/commission/commissions")]
    public class CommissionsController : Controller
    {
        public CommissionsController(ICommissionService commissionService, IAuthenticationService authenticationService)
        {
            CommissionService = commissionService;
            AuthenticationService = authenticationService;
        }

        private ICommissionService CommissionService { get; }
        private IAuthenticationService AuthenticationService { get; }

        [HttpGet("")]
        [UseCaseAuthorize("com_view_commissions")]
        public async Task<IActionResult> Index(string sortColumn, string sortDirection, int pageSize = 0, int pageNumber = 0, string filters = null)
        {
            var scope = AuthenticationService.GetScope(User);

            var queryOptions = new CommissionQueryOptions(scope, sortColumn, sortDirection, pageSize, pageNumber, filters);

            var commissions = await CommissionService.GetCommissions(queryOptions);

            return Ok(commissions);
        }

        [HttpGet("{commissionId}")]
        [UseCaseAuthorize("com_view_commissions")]
        public async Task<IActionResult> Get(Guid commissionId)
        {
            var scope = AuthenticationService.GetScope(User);

            var model = await CommissionService.GetCommission(scope, commissionId);

            if (model == null)
                return NotFound();

            return Ok(model);
        }

        [HttpPost]
        [UseCaseAuthorize("com_edit_commissions")]
        public async Task<IActionResult> Insert([FromBody] CommissionEdit commission)
        {
            var scope = AuthenticationService.GetScope(User);

            var result = await CommissionService.InsertCommission(scope, commission);

            if (!result.Success)
                return BadRequest(result.ValidationFailures);

            return Ok(result);
        }

        [HttpPost("{commissionId}")]
        [UseCaseAuthorize("com_edit_commissions")]
        public async Task<IActionResult> Update(Guid commissionId, [FromBody] CommissionEdit commission)
        {
            commission.Id = commissionId;

            var scope = AuthenticationService.GetScope(User);

            var result = await CommissionService.UpdateCommission(scope, commission);

            if (!result.Success)
                return BadRequest(result.ValidationFailures);

            return Ok(result);
        }
    }

}
