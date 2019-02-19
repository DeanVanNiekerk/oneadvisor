using System;
using System.Threading.Tasks;
using api.App.Authorization;
using api.Controllers.Commission.CommissionError.Dto;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using OneAdvisor.Model.Commission.Interface;
using OneAdvisor.Model.Common;
using OneAdvisor.Model.Directory.Interface;

namespace api.Controllers.Commission.CommissionError
{
    [ApiController]
    [Route("api/commission/statements/{commissionStatementId}")]
    public class CommissionErrorController : BaseController
    {
        public CommissionErrorController(IHttpContextAccessor contextAccessor, IMapper mapper, ICommissionErrorService commissionErrorService, IAuthService authService)
            : base(contextAccessor)
        {
            Mapper = mapper;
            CommissionErrorService = commissionErrorService;
            AuthService = authService;
        }

        private IMapper Mapper { get; }
        private ICommissionErrorService CommissionErrorService { get; }
        private IAuthService AuthService { get; }


        [HttpGet("errors/next")]
        [UseCaseAuthorize("com_edit_commission_statements")]
        public async Task<ActionResult<CommissionErrorDto>> Index(Guid commissionStatementId, bool hasValidFormat)
        {
            var scope = await AuthService.GetScope(UserId, Scope);

            var error = await CommissionErrorService.GetNextError(scope, commissionStatementId, hasValidFormat);

            if (error == null)
                return NotFound();

            return Ok(Mapper.Map<OneAdvisor.Model.Commission.Model.CommissionError.CommissionError, CommissionErrorDto>(error));
        }

        [HttpPost("errors/resolve/format")]
        [UseCaseAuthorize("com_edit_commission_statements")]
        public async Task<ActionResult<Result>> ResolveFormatError([FromBody] CommissionErrorDto commissionError)
        {
            var scope = await AuthService.GetScope(UserId, Scope);

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
            var scope = await AuthService.GetScope(UserId, Scope);

            var model = Mapper.Map<OneAdvisor.Model.Commission.Model.CommissionError.CommissionError>(commissionError);

            var result = await CommissionErrorService.ResolveMappingError(scope, model);

            if (!result.Success)
                return BadRequest(result.ValidationFailures);

            return Ok(result);
        }
    }

}
