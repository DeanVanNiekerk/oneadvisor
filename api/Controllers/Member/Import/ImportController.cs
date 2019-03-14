using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using api.App.Authorization;
using OneAdvisor.Model.Common;
using OneAdvisor.Model.Member.Interface;
using OneAdvisor.Model.Member.Model.ImportMember;
using OneAdvisor.Model.Account.Interface;

namespace api.Controllers.Member.Import
{

    [ApiController]
    [Route("api/member/import")]
    public class ImportController : Controller
    {
        public ImportController(IMemberImportService memberImportService, IAuthenticationService authenticationService)
        {
            MemberImportService = memberImportService;
            AuthenticationService = authenticationService;
        }

        private IMemberImportService MemberImportService { get; }
        private IAuthenticationService AuthenticationService { get; }

        [HttpPost("")]
        [UseCaseAuthorize("mem_import_members")]
        public async Task<IActionResult> Import([FromBody] ImportMember member)
        {
            var scope = AuthenticationService.GetScope(User);

            var result = await MemberImportService.ImportMember(scope, member);

            result.Tag = null;

            if (!result.Success)
                return BadRequest(result.ValidationFailures);

            return Ok(result);
        }
    }
}
