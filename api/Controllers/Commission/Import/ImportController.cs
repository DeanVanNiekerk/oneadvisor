using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
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
using OneAdvisor.Model.Commission.Model.CommissionStatementTemplate.Configuration;
using OneAdvisor.Model.Directory.Model.Role;
using OneAdvisor.Model.Storage.Interface;
using OneAdvisor.Model.Storage.Model.Path.Commission;

namespace api.Controllers.Commission.Import
{

    [ApiController]
    [Route("api/commission/import")]
    public class ImportController : Controller
    {
        public ImportController(ICommissionImportService commissionImportService,
            ICommissionStatementTemplateService commissionStatementTemplateService,
            IAuthenticationService authenticationService,
            IFileStorageService fileStorageService)
        {
            CommissionImportService = commissionImportService;
            AuthenticationService = authenticationService;
            CommissionStatementTemplateService = commissionStatementTemplateService;
            FileStorageService = fileStorageService;
        }

        private ICommissionImportService CommissionImportService { get; }
        private IAuthenticationService AuthenticationService { get; }
        private ICommissionStatementTemplateService CommissionStatementTemplateService { get; }
        private IFileStorageService FileStorageService { get; }


        [HttpPost("excel/{commissionStatementId}")]
        [UseCaseAuthorize("com_import_commissions")]
        public async Task<IActionResult> Import(Guid commissionStatementId, [FromQuery] Guid? commissionStatementTemplateId = null)
        {
            var scope = AuthenticationService.GetScope(User);

            var file = Request.Form.Files.FirstOrDefault();

            if (file == null)
                return BadRequest();

            Config config;
            if (commissionStatementTemplateId.HasValue)
            {
                var template = await CommissionStatementTemplateService.GetTemplate(commissionStatementTemplateId.Value);
                config = template.Config;
            }
            else
                config = await CommissionStatementTemplateService.GetDefaultConfig();

            using (var stream = file.OpenReadStream())
            {
                var reader = new CommissionImportReader(config);
                var items = reader.Read(stream);

                await CommissionImportService.ImportCommissions(scope, commissionStatementId, items);

                stream.Position = 0;
                var path = new CommissionStatementPath(scope.OrganisationId, commissionStatementId, file.Name);
                var storageName = await FileStorageService.AddFileAsync(path, stream);
            }

            return Ok();
        }

        [HttpGet("{commissionStatementId}/bigDataLoader")]
        [RoleAuthorize(Role.SUPER_ADMINISTRATOR_ROLE)]
        public async Task<IActionResult> BigDataLoader(Guid commissionStatementId, [FromQuery] int totalRecords)
        {
            await CommissionImportService.BigDataLoader(commissionStatementId, totalRecords);

            return Ok(new Result(true));
        }
    }
}