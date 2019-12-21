using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using OneAdvisor.Model.Commission.Interface;
using OneAdvisor.Model.Account.Model.Authentication;
using OneAdvisor.Model.Directory.Model.User;
using System;
using OneAdvisor.Model.Storage.Model.Path.Commission;
using OneAdvisor.Model.Storage.Interface;
using OneAdvisor.Model.Commission.Model.CommissionStatementTemplate;
using System.Linq;
using System.IO;
using OneAdvisor.Model.Commission.Model.ImportCommission;
using OneAdvisor.Import.Excel.Readers;
using function;
using OneAdvisor.Model.Directory.Interface;

namespace OneAdvisor.Function
{
    public class ImportCommission
    {
        public ImportCommission(
            ICommissionImportService commissionImportService,
            ICommissionStatementService commissionStatementService,
            ICommissionStatementTemplateService commissionStatementTemplateService,
            IFileStorageService fileStorageService,
            IDirectoryLookupService directoryLookupService)
        {
            CommissionImportService = commissionImportService;
            CommissionStatementService = commissionStatementService;
            CommissionStatementTemplateService = commissionStatementTemplateService;
            FileStorageService = fileStorageService;
            DirectoryLookupService = directoryLookupService;
        }

        private ICommissionImportService CommissionImportService { get; }
        private ICommissionStatementService CommissionStatementService { get; }
        private ICommissionStatementTemplateService CommissionStatementTemplateService { get; }
        private IFileStorageService FileStorageService { get; }
        private IDirectoryLookupService DirectoryLookupService { get; set; }


        [FunctionName("com_import_commission")]
        public async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Function, "get", "post", Route = null)] HttpRequest request,
            ILogger log)
        {
            Guid organisationId = Guid.Parse(request.Query["organisationId"]);
            Guid commissionStatementId = Guid.Parse(request.Query["commissionStatementId"]);
            Guid commissionStatementTemplateId = Guid.Parse(request.Query["commissionStatementTemplateId"]);

            var scope = new ScopeOptions(organisationId, Guid.Empty, Guid.Empty, Scope.Organisation);
            var statement = await CommissionStatementService.GetCommissionStatement(scope, commissionStatementId);

            if (statement == null)
                return new NotFoundObjectResult(commissionStatementId);

            var path = new CommissionStatementPath(scope.OrganisationId, commissionStatementId);
            var files = await FileStorageService.GetFilesAsync(path);

            if (!files.Any())
                return Utils.GetBadRequestObject("Reimport failed as there are no existing statement files.", commissionStatementId.ToString());

            var queryOptions = new CommissionStatementTemplateQueryOptions("", "", 0, 0);
            queryOptions.CompanyId.Add(statement.CompanyId.Value);
            queryOptions.Date = statement.Date;

            var templates = (await CommissionStatementTemplateService.GetTemplates(queryOptions)).Items;

            if (!templates.Any(t => t.Id == commissionStatementTemplateId))
                return Utils.GetBadRequestObject("Reimport failed as the commissionStatementTemplateId is not valid.", commissionStatementTemplateId.ToString());

            var template = await CommissionStatementTemplateService.GetTemplate(commissionStatementTemplateId);

            await CommissionStatementService.DeleteCommissions(scope, commissionStatementId);

            var result = new ImportResult();

            foreach (var fileInfo in files)
            {
                using (var stream = new MemoryStream())
                {
                    await FileStorageService.GetFile(fileInfo.Url, stream);

                    var vatRate = await DirectoryLookupService.GetVATRate(statement.Date ?? DateTime.Now);

                    var reader = new CommissionImportReader(template.Config, vatRate);
                    var items = reader.Read(stream);

                    result = await CommissionImportService.ImportCommissions(scope, commissionStatementId, items);
                }
            }

            return new OkObjectResult(result);
        }
    }
}
