using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using api.App.Authorization;
using OneAdvisor.Model.Directory.Interface;
using OneAdvisor.Model.Account.Interface;
using OneAdvisor.Model.Directory.Model.ChangeLog;
using OneAdvisor.Model.Directory.Model.Role;

namespace api.Controllers.Directory.ChangeLogs
{
    [ApiController]
    [Route("api/directory/changeLogs")]
    public class ChangeLogsController : Controller
    {
        public ChangeLogsController(IAuthenticationService authenticationService, IChangeLogService changeLogService)
        {
            ChangeLogService = changeLogService;
            AuthenticationService = authenticationService;
        }

        private IChangeLogService ChangeLogService { get; }
        private IAuthenticationService AuthenticationService { get; }

        [HttpGet("")]
        public async Task<IActionResult> Index(string sortColumn, string sortDirection, int pageSize = 0, int pageNumber = 0)
        {
            var queryOptions = new ChangeLogQueryOptions(sortColumn, sortDirection, pageSize, pageNumber);
            var pagedItems = await ChangeLogService.GetChangeLogs(queryOptions);

            return Ok(pagedItems);
        }

        [HttpGet("latest")]
        public async Task<IActionResult> Get()
        {
            var model = await ChangeLogService.GetLatestChangeLog();

            if (model == null)
                return NotFound();

            return Ok(model);
        }

        [HttpPost]
        [RoleAuthorize(Role.SUPER_ADMINISTRATOR_ROLE)]
        public async Task<IActionResult> Insert([FromBody] ChangeLog changeLog)
        {
            var result = await ChangeLogService.InsertChangeLog(changeLog);

            if (!result.Success)
                return BadRequest(result.ValidationFailures);

            return Ok(result);
        }

        [HttpPost("{changeLogId}")]
        [RoleAuthorize(Role.SUPER_ADMINISTRATOR_ROLE)]
        public async Task<IActionResult> Update(Guid changeLogId, [FromBody] ChangeLog changeLog)
        {
            changeLog.Id = changeLogId;

            var result = await ChangeLogService.UpdateChangeLog(changeLog);

            if (!result.Success)
                return BadRequest(result.ValidationFailures);

            return Ok(result);
        }
    }

}
