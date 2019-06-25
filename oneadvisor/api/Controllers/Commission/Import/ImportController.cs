using api;
using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using api.App.Authorization;
using OneAdvisor.Model.Commission.Interface;
using OneAdvisor.Import.Excel.Readers;
using OneAdvisor.Model.Account.Interface;
using OneAdvisor.Model.Commission.Model.CommissionStatementTemplate.Configuration;
using OneAdvisor.Model.Storage.Interface;
using OneAdvisor.Model.Storage.Model.Path.Commission;
using OneAdvisor.Model.Commission.Model.CommissionStatementTemplate;
using System.IO;
using OneAdvisor.Model.Commission.Model.ImportCommission;

namespace api.Controllers.Commission.Import
{

    [ApiController]
    [Route("api/commission/import")]
    public class ImportController : Controller
    {
        public ImportController(ICommissionImportService commissionImportService,
            ICommissionStatementService commissionStatementService,
            ICommissionStatementTemplateService commissionStatementTemplateService,
            IAuthenticationService authenticationService,
            IFileStorageService fileStorageService)
        {
            CommissionImportService = commissionImportService;
            CommissionStatementService = commissionStatementService;
            AuthenticationService = authenticationService;
            CommissionStatementTemplateService = commissionStatementTemplateService;
            FileStorageService = fileStorageService;
        }

        private ICommissionImportService CommissionImportService { get; }
        private ICommissionStatementService CommissionStatementService { get; }
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

            var result = new ImportResult();

            using (var stream = file.OpenReadStream())
            {
                var reader = new CommissionImportReader(config);
                var items = reader.Read(stream);

                var results = await CommissionImportService.ImportCommissions(scope, commissionStatementId, items);
                result.ImportCount = results.Count;
            }

            using (var stream = file.OpenReadStream())
            {
                var path = new CommissionStatementPath(scope.OrganisationId, commissionStatementId, file.FileName);
                var storageName = await FileStorageService.AddFileAsync(path, stream);
            }

            return Ok(result);
        }

        [HttpPost("excel/{commissionStatementId}/reimport")]
        [UseCaseAuthorize("com_import_commissions")]
        public async Task<IActionResult> Reimport(Guid commissionStatementId)
        {
            var scope = AuthenticationService.GetScope(User);

            var statement = await CommissionStatementService.GetCommissionStatement(scope, commissionStatementId);

            if (statement == null)
                return NotFound();

            var path = new CommissionStatementPath(scope.OrganisationId, commissionStatementId);
            var files = await FileStorageService.GetFilesAsync(path);

            if (!files.Any())
                return this.BadRequestMessage("Reimport failed as there are no existing statement files.");

            var queryOptions = new CommissionStatementTemplateQueryOptions("", "", 0, 0);
            queryOptions.CompanyId.Add(statement.CompanyId.Value);
            queryOptions.Date = statement.Date;

            var templates = (await CommissionStatementTemplateService.GetTemplates(queryOptions)).Items;

            if (!templates.Any())
                return this.BadRequestMessage("Reimport failed as there are no valid templates.");

            var template = await CommissionStatementTemplateService.GetTemplate(templates.First().Id);

            await CommissionStatementService.DeleteCommissions(scope, commissionStatementId);

            var result = new ImportResult();

            foreach (var fileInfo in files)
            {
                using (var stream = new MemoryStream())
                {
                    await FileStorageService.GetFile(fileInfo.Url, stream);

                    var reader = new CommissionImportReader(template.Config);
                    var items = reader.Read(stream);

                    var results = await CommissionImportService.ImportCommissions(scope, commissionStatementId, items);
                    result.ImportCount += results.Count;
                }
            }

            return Ok(result);
        }
    }
}