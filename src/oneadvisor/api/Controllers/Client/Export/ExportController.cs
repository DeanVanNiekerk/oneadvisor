using System;
using Microsoft.AspNetCore.Mvc;
using api.App.Authorization;
using Microsoft.AspNetCore.Http;
using OneAdvisor.Model.Client.Interface;
using OneAdvisor.Export.Csv.Renderers;
using OneAdvisor.Model.Client.Model.ExportClient;
using System.Threading.Tasks;
using OneAdvisor.Model.Account.Interface;
using System.IO;
using Microsoft.AspNetCore.Http.Features;

namespace api.Controllers.Client.Export
{
    [ApiController]
    [Route("api/client/export")]

    public class ExportController : Controller
    {
        public ExportController(IClientExportService clientExportService, IAuthenticationService authenticationService)
        {
            ClientExportService = clientExportService;
            AuthenticationService = authenticationService;
        }

        private IClientExportService ClientExportService { get; }
        private IAuthenticationService AuthenticationService { get; }

        [HttpGet("policyAggregates/csv")]
        [UseCaseAuthorize("clt_export_clients")]
        public async Task ExportPolicyAggregates()
        {
            //https://github.com/dotnet/aspnetcore/issues/7644
            var syncIOFeature = HttpContext.Features.Get<IHttpBodyControlFeature>();
            if (syncIOFeature != null)
                syncIOFeature.AllowSynchronousIO = true;

            var scope = AuthenticationService.GetScope(User);

            var csvRenderer = new CsvRenderer<ClientPolicyAggregate>();

            var fileName = $"Clients_{DateTime.Now.ToString("yyyy-MM-dd")}";
            SetResponseHeaders(Response, fileName);

            var stream = new MemoryStream();
            await ClientExportService.PolicyAggregates(csvRenderer, Response.Body, scope);
        }

        [HttpGet("policies/csv")]
        [UseCaseAuthorize("clt_export_clients")]
        public async Task ExportPolicies()
        {
            //https://github.com/dotnet/aspnetcore/issues/7644
            var syncIOFeature = HttpContext.Features.Get<IHttpBodyControlFeature>();
            if (syncIOFeature != null)
                syncIOFeature.AllowSynchronousIO = true;

            var scope = AuthenticationService.GetScope(User);

            var csvRenderer = new CsvRenderer<ClientPolicy>();

            var fileName = $"ClientPolicies_{DateTime.Now.ToString("yyyy-MM-dd")}";
            SetResponseHeaders(Response, fileName);

            await ClientExportService.Policies(csvRenderer, Response.Body, scope);
        }

        private void SetResponseHeaders(HttpResponse response, string fileName)
        {
            response.Headers.Add("Content-Disposition", $"attachment; filename={fileName}; filename*=UTF-8''{fileName}");
            response.Headers.Add("Content-Type", "text/csv");
        }
    }
}