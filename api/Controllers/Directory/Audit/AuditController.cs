using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using api.App.Authorization;
using OneAdvisor.Model.Directory.Interface;
using OneAdvisor.Model.Common;
using api.App.Dtos;
using Microsoft.AspNetCore.Http;
using api.Controllers.Directory.Audit.Dto;
using OneAdvisor.Model.Directory.Model.Audit;
using OneAdvisor.Model.Account.Interface;

namespace api.Controllers.Directory.Audit
{

    [ApiController]
    [Route("api/directory/audit")]
    public class AuditController : Controller
    {
        public AuditController(IMapper mapper, IAuthenticationService authenticationService, IAuditService auditService)
        {
            Mapper = mapper;
            AuditService = auditService;
            AuthenticationService = authenticationService;
        }

        private IMapper Mapper { get; }
        private IAuditService AuditService { get; }
        private IAuthenticationService AuthenticationService { get; }

        [HttpGet("logs")]
        [UseCaseAuthorize("dir_view_audit_logs")]
        public async Task<PagedItemsDto<AuditLogDto>> Index(string sortColumn, string sortDirection, int pageSize = 0, int pageNumber = 0, string filters = null)
        {
            var scope = AuthenticationService.GetScope(User, true);

            var queryOptions = new AuditLogQueryOptions(scope, sortColumn, sortDirection, pageSize, pageNumber, filters);
            var pagedItems = await AuditService.GetAuditLogs(queryOptions);

            return Mapper.MapToPageItemsDto<AuditLog, AuditLogDto>(pagedItems);
        }
    }
}
