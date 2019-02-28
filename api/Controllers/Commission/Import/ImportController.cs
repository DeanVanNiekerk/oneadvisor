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
using OneAdvisor.Model.Account.Interface;

namespace api.Controllers.Commission.Import
{

    [ApiController]
    [Route("api/commission/import")]
    public class ImportController : Controller
    {
        public ImportController(IMapper mapper, ICommissionImportService commissionImportService, IAuthenticationService authenticationService)
        {
            Mapper = mapper;
            CommissionImportService = commissionImportService;
            AuthenticationService = authenticationService;
        }

        private IMapper Mapper { get; }
        private ICommissionImportService CommissionImportService { get; }
        private IAuthenticationService AuthenticationService { get; }

        [HttpPost("excel/{commissionStatementId}")]
        [UseCaseAuthorize("com_import_commissions")]
        public async Task<IActionResult> Import(Guid commissionStatementId)
        {
            var scope = AuthenticationService.GetScope(User);

            var file = Request.Form.Files.FirstOrDefault();

            if (file == null)
                return BadRequest();

            var reader = new CommissionImportReader();
            var items = reader.Read(file.OpenReadStream());

            await CommissionImportService.ImportCommissions(scope, commissionStatementId, items);

            return Ok();
        }
    }
}