using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using api.App.Authorization;
using OneAdvisor.Model.Directory.Interface;
using OneAdvisor.Model.Directory.Model.Audit;
using OneAdvisor.Model.Account.Interface;

namespace api.Controllers.Directory.Audit
{
    [ApiController]
    [Route("api/directory/audit")]
    public class AuditController : Controller
    {
        public AuditController(IAuthenticationService authenticationService, IAuditService auditService)
        {
            AuditService = auditService;
            AuthenticationService = authenticationService;
        }

        private IAuditService AuditService { get; }
        private IAuthenticationService AuthenticationService { get; }

        [HttpGet("logs")]
        [UseCaseAuthorize("dir_view_audit_logs")]
        public async Task<IActionResult> Index(string sortColumn, string sortDirection, string filters = null)
        {
            var scope = AuthenticationService.GetScope(User);

            var queryOptions = new AuditLogQueryOptions(scope, sortColumn, sortDirection, filters);
            var pagedItems = await AuditService.GetAuditLogs(queryOptions);

            return Ok(pagedItems);
        }
    }
}
