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
using OneAdvisor.Model.Commission.Model.ImportCommission;
using OneAdvisor.Import.Excel.Readers;

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

        [HttpPost("excel/{commissionStatementId}")]
        [UseCaseAuthorize("com_import_commissions")]
        public async Task<IActionResult> Import(Guid commissionStatementId)
        {
            var scope = await AuthService.GetScope(UserId, Scope);

            var file = Request.Form.Files.FirstOrDefault();

            if (file == null)
                return BadRequest();

            var reader = new CommissionImportExcelReader();
            var items = reader.Read(file.OpenReadStream());

            await CommissionImportService.ImportCommissions(scope, commissionStatementId, items);

            return Ok();
        }
    }
}