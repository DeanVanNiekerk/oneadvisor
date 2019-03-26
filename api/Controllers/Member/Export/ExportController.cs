using System;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using api.App.Authorization;
using Microsoft.AspNetCore.Http;
using OneAdvisor.Model.Member.Interface;
using OneAdvisor.Model.Directory.Interface;
using OneAdvisor.Export.Csv.Renderers;
using OneAdvisor.Model.Member.Model.ExportMember;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using OneAdvisor.Model.Account.Interface;

namespace api.Controllers.Member.Export
{
    [ApiController]
    [Route("api/member/export")]

    public class ExportController : Controller
    {
        public ExportController(IMemberExportService memberExportService, IAuthenticationService authenticationService)
        {
            MemberExportService = memberExportService;
            AuthenticationService = authenticationService;
        }

        private IMemberExportService MemberExportService { get; }
        private IAuthenticationService AuthenticationService { get; }

        [HttpGet("/policyAggregates/csv")]
        [UseCaseAuthorize("mem_export_members")]
        public async Task ExportPolicyAggregates()
        {
            var scope = AuthenticationService.GetScope(User);

            var csvRenderer = new CsvRenderer<MemberPolicyAggregate>();

            var fileName = $"Members_{DateTime.Now.ToString("yyyy-MM-dd")}";
            Response.Headers.Add("Content-Disposition", $"attachment; filename={fileName}; filename*=UTF-8''{fileName}");
            Response.Headers.Add("Content-Type", "text/csv");

            await MemberExportService.PolicyAggregates(csvRenderer, Response.Body, scope);
        }
    }
}