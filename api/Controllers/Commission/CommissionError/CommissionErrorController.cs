using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using api.App.Authorization;
using api.Controllers.Commission.CommissionError.Dto;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using OneAdvisor.Model.Account.Interface;
using OneAdvisor.Model.Commission.Interface;
using OneAdvisor.Model.Commission.Model.Commission;
using OneAdvisor.Model.Common;
using OneAdvisor.Model.Directory.Interface;

namespace api.Controllers.Commission.CommissionError
{
    [ApiController]
    [Route("api/commission/statements/{commissionStatementId}")]
    public class CommissionErrorController : Controller
    {
        public CommissionErrorController(IMapper mapper, ICommissionErrorService commissionErrorService, IAuthenticationService authenticationService)
        {
            Mapper = mapper;
            CommissionErrorService = commissionErrorService;
            AuthenticationService = authenticationService;
        }

        private IMapper Mapper { get; }
        private ICommissionErrorService CommissionErrorService { get; }
        private IAuthenticationService AuthenticationService { get; }


        [HttpGet("errors/next")]
        [UseCaseAuthorize("com_edit_commission_statements")]
        public async Task<ActionResult<CommissionErrorDto>> Next(Guid commissionStatementId, [FromQuery] bool hasValidFormat)
        {
            var scope = AuthenticationService.GetScope(User);

            var error = await CommissionErrorService.GetNextError(scope, commissionStatementId, hasValidFormat);

            if (error == null)
                return NotFound();

            return Ok(Mapper.Map<OneAdvisor.Model.Commission.Model.CommissionError.CommissionError, CommissionErrorDto>(error));
        }

        [HttpPost("errors/resolve/format")]
        [UseCaseAuthorize("com_edit_commission_statements")]
        public async Task<ActionResult<Result>> ResolveFormatError([FromBody] CommissionErrorDto commissionError)
        {
            var scope = AuthenticationService.GetScope(User);

            var model = Mapper.Map<OneAdvisor.Model.Commission.Model.CommissionError.CommissionError>(commissionError);

            var result = await CommissionErrorService.ResolveFormatError(scope, model);

            if (!result.Success)
                return BadRequest(result.ValidationFailures);

            return Ok(result);
        }

        [HttpPost("errors/resolve/mapping")]
        [UseCaseAuthorize("com_edit_commission_statements")]
        public async Task<ActionResult<Result>> ResolveMappingError([FromBody] CommissionErrorDto commissionError)
        {
            var scope = AuthenticationService.GetScope(User);

            var model = Mapper.Map<OneAdvisor.Model.Commission.Model.CommissionError.CommissionError>(commissionError);

            var result = await CommissionErrorService.ResolveMappingError(scope, model);

            if (!result.Success)
                return BadRequest(result.ValidationFailures);

            var commission = result.Tag as CommissionEdit;
            await CommissionErrorService.AutoResolveMappingErrors(scope, commission.CommissionStatementId.Value, commission.PolicyId.Value);

            return Ok(result);
        }

        [HttpGet("errors")]
        [UseCaseAuthorize("com_edit_commission_statements")]
        public async Task<List<CommissionErrorDto>> Index(Guid commissionStatementId, [FromQuery] bool hasValidFormat = true)
        {
            var scope = AuthenticationService.GetScope(User);

            var results = await CommissionErrorService.GetErrors(scope, commissionStatementId, hasValidFormat);

            return Mapper.MapList<OneAdvisor.Model.Commission.Model.CommissionError.CommissionError, CommissionErrorDto>(results);
        }
    }

}
