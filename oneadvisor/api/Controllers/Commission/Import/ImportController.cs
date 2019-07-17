using api;
using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using api.App.Authorization;
using OneAdvisor.Model.Commission.Interface;
using OneAdvisor.Import.Excel.Readers;
using OneAdvisor.Model.Account.Interface;
using OneAdvisor.Model.Storage.Interface;
using OneAdvisor.Model.Storage.Model.Path.Commission;
using OneAdvisor.Model.Commission.Model.CommissionStatementTemplate;
using System.IO;
using OneAdvisor.Model.Commission.Model.ImportCommission;
using OneAdvisor.Model.Commission.Model.CommissionStatement;
using System.Collections.Generic;
using OneAdvisor.Model.Account.Model.Authentication;
using OneAdvisor.Model.Email;
using OneAdvisor.Model.Directory.Interface;
using api.App;
using OneAdvisor.Model.Email.Model;

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
            IFileStorageService fileStorageService,
            IEmailService emailService,
            IOrganisationService organisationService,
            IUserService userService,
            IDirectoryLookupService directoryLookupService)
        {
            CommissionImportService = commissionImportService;
            CommissionStatementService = commissionStatementService;
            AuthenticationService = authenticationService;
            CommissionStatementTemplateService = commissionStatementTemplateService;
            FileStorageService = fileStorageService;
            EmailService = emailService;
            OrganisationService = organisationService;
            UserService = userService;
            DirectoryLookupService = directoryLookupService;
        }

        private ICommissionImportService CommissionImportService { get; }
        private ICommissionStatementService CommissionStatementService { get; }
        private IAuthenticationService AuthenticationService { get; }
        private ICommissionStatementTemplateService CommissionStatementTemplateService { get; }
        private IFileStorageService FileStorageService { get; }
        private IEmailService EmailService { get; }
        private IOrganisationService OrganisationService { get; }
        private IUserService UserService { get; }
        public IDirectoryLookupService DirectoryLookupService { get; set; }

        [HttpPost("excel/{commissionStatementId}")]
        [UseCaseAuthorize("com_import_commissions")]
        public async Task<IActionResult> Import(Guid commissionStatementId, [FromQuery] Guid commissionStatementTemplateId)
        {
            var scope = AuthenticationService.GetScope(User);

            var file = Request.Form.Files.FirstOrDefault();

            if (file == null)
                return BadRequest();

            var template = await CommissionStatementTemplateService.GetTemplate(commissionStatementTemplateId);
            var config = template.Config;

            var result = new ImportResult();

            using (var stream = file.OpenReadStream())
            {
                var reader = new CommissionImportReader(config);
                var items = reader.Read(stream);

                result = await CommissionImportService.ImportCommissions(scope, commissionStatementId, items);

                //Dont hold up the thread whilst sending the email
                if (result.UnknownCommissionTypeValues.Any())
                {
                    var attachment = new Attachment();
                    attachment.FileName = file.FileName;
                    attachment.ContentType = file.ContentType;
                    attachment.Data = file.OpenReadStream();
                    await SendUnkownCommissionTypesEmail(result, scope, commissionStatementId, template, attachment).ConfigureAwait(false);
                }
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

                    result = await CommissionImportService.ImportCommissions(scope, commissionStatementId, items);

                    //Dont hold up the thread whilst sending the email
                    stream.Position = 0;
                    if (result.UnknownCommissionTypeValues.Any())
                    {
                        var attachment = new Attachment();
                        attachment.FileName = fileInfo.Name;
                        attachment.ContentType = fileInfo.ContentType;
                        attachment.Data = stream;
                        await SendUnkownCommissionTypesEmail(result, scope, commissionStatementId, template, attachment).ConfigureAwait(false);
                    }
                }
            }

            return Ok(result);
        }

        [HttpPost("excel/reimport")]
        [UseCaseAuthorize("com_import_commissions")]
        public async Task<IActionResult> ReimportBulk([FromQuery] DateTime? startDate, [FromQuery] DateTime? endDate)
        {
            var scope = AuthenticationService.GetScope(User);

            var queryOptions = new CommissionStatementQueryOptions(scope, "", "", 0, 0);
            queryOptions.StartDate = startDate;
            queryOptions.EndDate = endDate;
            var pagedItems = await CommissionStatementService.GetCommissionStatements(queryOptions);

            var results = new List<IActionResult>();
            foreach (var statement in pagedItems.Items)
            {
                results.Add(await Reimport(statement.Id));
            }

            return Ok(results);
        }

        private async Task SendUnkownCommissionTypesEmail(
            ImportResult result,
            ScopeOptions scope,
            Guid commissionStatementId,
            CommissionStatementTemplateEdit template,
            Attachment attachment)
        {
            var organisation = await OrganisationService.GetOrganisation(scope, scope.OrganisationId);
            var user = await UserService.GetUser(scope, scope.UserId);
            var statement = await CommissionStatementService.GetCommissionStatement(scope, commissionStatementId);
            var company = await DirectoryLookupService.GetCompany(statement.CompanyId.Value);

            await EmailService.SendUnkownCommissionTypesEmail(Utils.GetEnvironment(), organisation, user, company, statement, template, result.UnknownCommissionTypeValues, attachment);
        }
    }
}