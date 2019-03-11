using System;
using System.Threading.Tasks;
using api.App.Authorization;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using OneAdvisor.Model.Account.Interface;
using OneAdvisor.Model.Commission.Interface;
using OneAdvisor.Model.Commission.Model.CommissionStatement;
using OneAdvisor.Model.Common;
using OneAdvisor.Model.Directory.Interface;
using OneAdvisor.Model.Directory.Model.Role;

namespace api.Controllers.Commission.CommissionStatements
{
    [ApiController]
    [Route("api/commission/statements")]
    public class CommissionStatementsController : Controller
    {
        public CommissionStatementsController(ICommissionStatementService commissionStatementService, IAuthenticationService authenticationService)
        {
            CommissionStatementService = commissionStatementService;
            AuthenticationService = authenticationService;
        }

        private ICommissionStatementService CommissionStatementService { get; }
        private IAuthenticationService AuthenticationService { get; }


        [HttpGet("")]
        [UseCaseAuthorize("com_view_commission_statements")]
        public async Task<IActionResult> Index(string sortColumn, string sortDirection, int pageSize = 0, int pageNumber = 0, string filters = null)
        {
            var scope = AuthenticationService.GetScope(User);

            var queryOptions = new CommissionStatementQueryOptions(scope, sortColumn, sortDirection, pageSize, pageNumber, filters);
            var pagedItems = await CommissionStatementService.GetCommissionStatements(queryOptions);

            return Ok(pagedItems);
        }

        [HttpGet("{commissionStatementId}")]
        [UseCaseAuthorize("com_view_commission_statements")]
        public async Task<IActionResult> Get(Guid commissionStatementId)
        {
            var scope = AuthenticationService.GetScope(User);

            var model = await CommissionStatementService.GetCommissionStatement(scope, commissionStatementId);

            if (model == null)
                return NotFound();

            return Ok(model);
        }

        [HttpPost]
        [UseCaseAuthorize("com_edit_commission_statements")]
        public async Task<IActionResult> Insert([FromBody] CommissionStatementEdit commissionStatement)
        {
            var scope = AuthenticationService.GetScope(User);

            var result = await CommissionStatementService.InsertCommissionStatement(scope, commissionStatement);

            if (!result.Success)
                return BadRequest(result.ValidationFailures);

            return Ok(result);
        }

        [HttpPost("{commissionStatementId}")]
        [UseCaseAuthorize("com_edit_commission_statements")]
        public async Task<IActionResult> Update(Guid commissionStatementId, [FromBody] CommissionStatementEdit commissionStatement)
        {
            commissionStatement.Id = commissionStatementId;

            var scope = AuthenticationService.GetScope(User);

            var result = await CommissionStatementService.UpdateCommissionStatement(scope, commissionStatement);

            if (!result.Success)
                return BadRequest(result.ValidationFailures);

            return Ok(result);
        }

        [HttpDelete("{commissionStatementId}/commissions")]
        [UseCaseAuthorize("com_edit_commission_statements")]
        public async Task<IActionResult> DeleteCommissions(Guid commissionStatementId)
        {
            var scope = AuthenticationService.GetScope(User);

            await CommissionStatementService.DeleteCommissions(scope, commissionStatementId);

            return Ok(new Result(true));
        }
    }
}
