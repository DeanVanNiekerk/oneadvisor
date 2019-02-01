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
using OneAdvisor.Model.Directory.Interface;
using OneAdvisor.Model.Commission.Interface;
using api.Controllers.Commission.Import.Dto;
using OneAdvisor.Model.Commission.Model.ImportCommission;

namespace api.Controllers.Commission.Import
{

    [ApiController]
    [Route("api/commission/import")]
    public class ImportController : BaseController
    {
        public ImportController(IHttpContextAccessor contextAccessor, IMapper mapper, ICommissionImportService commissionImportService, IAuthService authService)
            : base(contextAccessor)
        {
            Mapper = mapper;
            CommissionImportService = commissionImportService;
            AuthService = authService;
        }

        private IMapper Mapper { get; }
        private ICommissionImportService CommissionImportService { get; }
        private IAuthService AuthService { get; }

        [HttpPost("")]
        [UseCaseAuthorize("com_import_commissions")]
        public async Task<ActionResult<Result>> Import([FromBody] ImportCommissionDto commission)
        {
            var model = Mapper.Map<ImportCommission>(commission);

            var scope = await AuthService.GetScope(UserId, Scope);

            var result = await CommissionImportService.ImportCommission(scope, model);

            result.Tag = null;

            if (!result.Success)
                return BadRequest(result.ValidationFailures);

            return Ok(result);
        }
    }
}