using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using api.App.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using OneAdvisor.Model.Account.Interface;
using OneAdvisor.Model.Commission.Interface;
using OneAdvisor.Model.Commission.Model.Commission;
using OneAdvisor.Model.Commission.Model.CommissionError;
using OneAdvisor.Model.Common;
using OneAdvisor.Model.Directory.Interface;

namespace api.Controllers.Commission.CommissionError
{
    [ApiController]
    [Route("api/commission/statements/{commissionStatementId}")]
    public class CommissionErrorController : Controller
    {
        public CommissionErrorController(ICommissionErrorService commissionErrorService, IAuthenticationService authenticationService)
        {
            CommissionErrorService = commissionErrorService;
            AuthenticationService = authenticationService;
        }

        private ICommissionErrorService CommissionErrorService { get; }
        private IAuthenticationService AuthenticationService { get; }


        [HttpGet("errors/next")]
        [UseCaseAuthorize("com_edit_commission_statements")]
        public async Task<IActionResult> Next(Guid commissionStatementId, [FromQuery] bool hasValidFormat)
        {
            var scope = AuthenticationService.GetScope(User);

            var error = await CommissionErrorService.GetNextError(scope, commissionStatementId, hasValidFormat);

            if (error == null)
                return NotFound();

            return Ok(error);
        }

        [HttpGet("errors/{commissionErrorId}")]
        [UseCaseAuthorize("com_edit_commission_statements")]
        public async Task<IActionResult> Get(Guid commissionErrorId)
        {
            var scope = AuthenticationService.GetScope(User);

            var error = await CommissionErrorService.GetError(scope, commissionErrorId);

            if (error == null)
                return NotFound();

            return Ok(error);
        }

        [HttpPost("errors/resolve/format")]
        [UseCaseAuthorize("com_edit_commission_statements")]
        public async Task<IActionResult> ResolveFormatError([FromBody] OneAdvisor.Model.Commission.Model.CommissionError.CommissionErrorEdit commissionError)
        {
            var scope = AuthenticationService.GetScope(User);

            var result = await CommissionErrorService.ResolveFormatError(scope, commissionError);

            if (!result.Success)
                return BadRequest(result.ValidationFailures);

            return Ok(result);
        }

        [HttpPost("errors/resolve/mapping")]
        [UseCaseAuthorize("com_edit_commission_statements")]
        public async Task<IActionResult> ResolveMappingError([FromBody] OneAdvisor.Model.Commission.Model.CommissionError.CommissionErrorEdit commissionError)
        {
            var scope = AuthenticationService.GetScope(User);

            var result = await CommissionErrorService.ResolveMappingError(scope, commissionError);

            if (!result.Success)
                return BadRequest(result.ValidationFailures);

            var commission = result.Tag as CommissionEdit;
            await CommissionErrorService.AutoResolveMappingErrors(scope, commission.CommissionStatementId.Value, commission.PolicyId.Value);

            return Ok(result);
        }

        [HttpGet("errors")]
        [UseCaseAuthorize("com_edit_commission_statements")]
        public async Task<IActionResult> Index(Guid commissionStatementId, string sortColumn, string sortDirection, int pageSize = 0, int pageNumber = 0, string filters = null)
        {
            var scope = AuthenticationService.GetScope(User);

            var options = new CommissionErrorQueryOptions(scope, sortColumn, sortDirection, pageSize, pageNumber, filters);
            options.CommissionStatementId = commissionStatementId;

            var results = await CommissionErrorService.GetErrors(options);

            return Ok(results);
        }

        [HttpDelete("errors/{commissionErrorId}")]
        [UseCaseAuthorize("com_edit_commission_statements")]
        public async Task<IActionResult> Delete(Guid commissionErrorId)
        {
            var scope = AuthenticationService.GetScope(User);

            var result = await CommissionErrorService.DeleteError(scope, commissionErrorId);

            if (!result.Success)
                return BadRequest(result.ValidationFailures);

            return Ok(result);
        }
    }

}
