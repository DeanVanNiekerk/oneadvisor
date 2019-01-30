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

namespace api.Controllers.Member.Export
{
    [ApiController]
    [Route("api/member/export")]

    public class ExportController : BaseController
    {
        public ExportController(IHttpContextAccessor contextAccessor, IMemberExportService memberExportService, IAuthService authService)
            : base(contextAccessor)
        {
            MemberExportService = memberExportService;
            AuthService = authService;
        }

        private IMemberExportService MemberExportService { get; }
        private IAuthService AuthService { get; }

        [HttpGet("")]
        [UseCaseAuthorize("mem_export_members")]
        public async Task Export()
        {
            var scope = await AuthService.GetScope(UserId, Scope);

            var csvRenderer = new MemberExportCsvRenderer();
            var queryOptions = new ExportMemberQueryOptions(scope, new List<string>());

            var fileName = $"Members_{DateTime.Now.ToString("yyyy-MM-dd")}";
            Response.Headers.Add("Content-Disposition", $"attachment; filename={fileName}; filename*=UTF-8''{fileName}");
            Response.Headers.Add("Content-Type", "text/csv");

            await MemberExportService.Export(csvRenderer, Response.Body, queryOptions);
        }
    }
}