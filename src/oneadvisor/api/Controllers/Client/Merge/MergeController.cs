using System.Threading.Tasks;
using api.App.Authorization;
using Microsoft.AspNetCore.Mvc;
using OneAdvisor.Model.Account.Interface;
using OneAdvisor.Model.Client.Interface;
using OneAdvisor.Model.Client.Model.Client.Merge;
using OneAdvisor.Model.Client.Model.Policy.Merge;

namespace api.Controllers.Client.Merge
{
    [ApiController]
    [Route("api/client/merge")]
    public class MergeController : Controller
    {
        public MergeController(IClientService clientService, IPolicyService policyService, IAuthenticationService authenticationService)
        {
            ClientService = clientService;
            PolicyService = policyService;
            AuthenticationService = authenticationService;
        }

        private IClientService ClientService { get; }
        private IPolicyService PolicyService { get; }
        private IAuthenticationService AuthenticationService { get; }

        [HttpPost("clients")]
        [UseCaseAuthorize("clt_edit_clients")]
        public async Task<IActionResult> MergeClients([FromBody] MergeClients merge)
        {
            var scope = AuthenticationService.GetScope(User);

            var result = await ClientService.MergeClients(scope, merge);

            if (!result.Success)
                return BadRequest(result.ValidationFailures);

            return Ok(result);
        }

        [HttpPost("policies")]
        [UseCaseAuthorize("clt_edit_policies")]
        public async Task<IActionResult> MergePolicies([FromBody] MergePolicies merge)
        {
            var scope = AuthenticationService.GetScope(User);

            var result = await PolicyService.MergePolicies(scope, merge);

            if (!result.Success)
                return BadRequest(result.ValidationFailures);

            return Ok(result);
        }

    }
}