using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using api.App.Authorization;
using OneAdvisor.Model.Common;
using OneAdvisor.Model.Client.Interface;
using OneAdvisor.Model.Client.Model.ImportClient;
using OneAdvisor.Model.Account.Interface;

namespace api.Controllers.Client.Import
{

    [ApiController]
    [Route("api/client/import")]
    public class ImportController : Controller
    {
        public ImportController(IClientImportService clientImportService, IAuthenticationService authenticationService)
        {
            ClientImportService = clientImportService;
            AuthenticationService = authenticationService;
        }

        private IClientImportService ClientImportService { get; }
        private IAuthenticationService AuthenticationService { get; }

        [HttpPost("")]
        [UseCaseAuthorize("clt_import_clients")]
        public async Task<IActionResult> Import([FromBody] ImportClient client)
        {
            var scope = AuthenticationService.GetScope(User);

            var result = await ClientImportService.ImportClient(scope, client);

            result.Tag = null;

            if (!result.Success)
                return BadRequest(result.ValidationFailures);

            return Ok(result);
        }
    }
}
