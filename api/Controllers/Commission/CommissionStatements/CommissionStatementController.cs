using System;
using System.Threading.Tasks;
using api.App.Authorization;
using api.Controllers.Commission.CommissionStatements.Dto;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using OneAdvisor.Model.Commission.Interface;
using OneAdvisor.Model.Commission.Model.CommissionStatement;
using OneAdvisor.Model.Common;
using OneAdvisor.Model.Directory.Interface;

namespace api.Controllers.Commission.CommissionStatements
{
    [ApiController]
    [Route("api/commission/statements")]
    public class CommissionStatementsController : Controller
    {
        public CommissionStatementsController(IMapper mapper, ICommissionStatementService commissionStatementService, ICommissionService commissionService, IAuthenticationService authenticationService)
        {
            Mapper = mapper;
            CommissionStatementService = commissionStatementService;
            CommissionService = commissionService;
            AuthenticationService = authenticationService;
        }

        private IMapper Mapper { get; }
        private ICommissionStatementService CommissionStatementService { get; }
        private ICommissionService CommissionService { get; }
        private IAuthenticationService AuthenticationService { get; }


        [HttpGet("")]
        [UseCaseAuthorize("com_view_commission_statements")]
        public async Task<PagedCommissionStatementsDto> Index(string sortColumn, string sortDirection, int pageSize = 0, int pageNumber = 0, string filters = null)
        {
            var scope = AuthenticationService.GetScope(User);

            var queryOptions = new CommissionStatementQueryOptions(scope, sortColumn, sortDirection, pageSize, pageNumber, filters);
            var pagedItems = await CommissionStatementService.GetCommissionStatements(queryOptions);

            return Mapper.Map<PagedCommissionStatements, PagedCommissionStatementsDto>(pagedItems);
        }

        [HttpGet("{commissionStatementId}")]
        [UseCaseAuthorize("com_view_commission_statements")]
        public async Task<ActionResult<CommissionStatementEditDto>> Get(Guid commissionStatementId)
        {
            var scope = AuthenticationService.GetScope(User);

            var model = await CommissionStatementService.GetCommissionStatement(scope, commissionStatementId);

            if (model == null)
                return NotFound();

            return Ok(Mapper.Map<CommissionStatementEditDto>(model));
        }

        [HttpPost]
        [UseCaseAuthorize("com_edit_commission_statements")]
        public async Task<ActionResult<Result>> Insert([FromBody] CommissionStatementEditDto commissionStatement)
        {
            var scope = AuthenticationService.GetScope(User);

            var model = Mapper.Map<CommissionStatementEdit>(commissionStatement);

            var result = await CommissionStatementService.InsertCommissionStatement(scope, model);

            if (!result.Success)
                return BadRequest(result.ValidationFailures);

            return Ok(result);
        }

        [HttpPost("{commissionStatementId}")]
        [UseCaseAuthorize("com_edit_commission_statements")]
        public async Task<ActionResult<Result>> Update(Guid commissionStatementId, [FromBody] CommissionStatementEditDto commissionStatement)
        {
            commissionStatement.Id = commissionStatementId;

            var model = Mapper.Map<CommissionStatementEdit>(commissionStatement);

            var scope = AuthenticationService.GetScope(User);

            var result = await CommissionStatementService.UpdateCommissionStatement(scope, model);

            if (!result.Success)
                return BadRequest(result.ValidationFailures);

            return Ok(result);
        }

        [HttpDelete("{commissionStatementId}/commissions")]
        [UseCaseAuthorize("com_edit_commission_statements")]
        public async Task<ActionResult<Result>> DeleteCommissions(Guid commissionStatementId)
        {
            var scope = AuthenticationService.GetScope(User);

            await CommissionService.DeleteCommissions(scope, commissionStatementId);

            return Ok(new { Success = true });
        }
    }

}
