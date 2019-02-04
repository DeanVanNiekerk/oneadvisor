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
    [Route("api/commission/commissionStatements")]
    public class CommissionStatementsController : BaseController
    {
        public CommissionStatementsController(IHttpContextAccessor contextAccessor, IMapper mapper, ICommissionStatementService commissionStatementService, IAuthService authService)
            : base(contextAccessor)
        {
            Mapper = mapper;
            CommissionStatementService = commissionStatementService;
            AuthService = authService;
        }

        private IMapper Mapper { get; }
        private ICommissionStatementService CommissionStatementService { get; }
        private IAuthService AuthService { get; }

        [HttpGet("")]
        [UseCaseAuthorize("com_view_commission_statements")]
        public async Task<PagedCommissionStatementsDto> Index(string sortColumn, string sortDirection, int pageSize = 0, int pageNumber = 0, string filters = null)
        {
            var scope = await AuthService.GetScope(UserId, Scope);

            var queryOptions = new CommissionStatementQueryOptions(scope, sortColumn, sortDirection, pageSize, pageNumber, filters);
            var pagedItems = await CommissionStatementService.GetCommissionStatements(queryOptions);

            return Mapper.Map<PagedCommissionStatements, PagedCommissionStatementsDto>(pagedItems);
        }

        [HttpGet("{commissionId}")]
        [UseCaseAuthorize("com_view_commission_statements")]
        public async Task<ActionResult<CommissionStatementEditDto>> Get(Guid commissionStatementId)
        {
            var scope = await AuthService.GetScope(UserId, Scope);

            var model = CommissionStatementService.GetCommissionStatement(scope, commissionStatementId).Result;

            if (model == null)
                return NotFound();

            return Ok(Mapper.Map<CommissionStatementEditDto>(model));
        }

        [HttpPost]
        [UseCaseAuthorize("com_edit_commission_statements")]
        public async Task<ActionResult<Result>> Insert([FromBody] CommissionStatementEditDto commissionStatement)
        {
            var scope = await AuthService.GetScope(UserId, Scope);

            var model = Mapper.Map<CommissionStatementEdit>(commissionStatement);

            var result = await CommissionStatementService.InsertCommissionStatement(scope, model);

            if (!result.Success)
                return BadRequest(result.ValidationFailures);

            return Ok(result);
        }

        [HttpPost("{commissionId}")]
        [UseCaseAuthorize("com_edit_commission_statements")]
        public async Task<ActionResult<Result>> Update(Guid commissionStatementId, [FromBody] CommissionStatementEditDto commissionStatement)
        {
            commissionStatement.Id = commissionStatementId;

            var model = Mapper.Map<CommissionStatementEdit>(commissionStatement);

            var scope = await AuthService.GetScope(UserId, Scope);

            var result = await CommissionStatementService.UpdateCommissionStatement(scope, model);

            if (!result.Success)
                return BadRequest(result.ValidationFailures);

            return Ok(result);
        }
    }

}
