using System.Threading.Tasks;
using api.App.Authorization;
using Microsoft.AspNetCore.Mvc;
using OneAdvisor.Model.Account.Interface;
using OneAdvisor.Model.Client.Interface;
using OneAdvisor.Model.Client.Model.Client.Merge;

namespace api.Controllers.Client.Merge
{
    [ApiController]
    [Route("api/client/merge")]
    public class MergeController : Controller
    {
        public MergeController(IClientService clientService, IAuthenticationService authenticationService)
        {
            ClientService = clientService;
            AuthenticationService = authenticationService;
        }

        private IClientService ClientService { get; }
        private IAuthenticationService AuthenticationService { get; }

        [HttpPost]
        [UseCaseAuthorize("clt_edit_clients")]
        public async Task<IActionResult> Merge([FromBody] MergeClients merge)
        {
            var scope = AuthenticationService.GetScope(User);

            var result = await ClientService.MergeClients(scope, merge);

            if (!result.Success)
                return BadRequest(result.ValidationFailures);

            return Ok(result);
        }

    }
}