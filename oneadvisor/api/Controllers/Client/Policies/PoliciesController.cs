using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using api.App.Authorization;
using OneAdvisor.Model.Common;
using OneAdvisor.Model.Client.Interface;
using Microsoft.AspNetCore.Http;
using OneAdvisor.Model.Directory.Interface;
using OneAdvisor.Model.Client.Model.Policy;
using OneAdvisor.Model.Account.Interface;

namespace api.Controllers.Client.Clients
{

    [ApiController]
    [Route("api/client/policies")]
    public class PoliciesController : Controller
    {
        public PoliciesController(IPolicyService policyService, IAuthenticationService authenticationService)
        {
            PolicyService = policyService;
            AuthenticationService = authenticationService;
        }

        private IPolicyService PolicyService { get; }
        private IAuthenticationService AuthenticationService { get; }


        [HttpGet("")]
        [UseCaseAuthorize("clt_view_policies")]
        public async Task<IActionResult> Index(string sortColumn, string sortDirection, int pageSize = 0, int pageNumber = 0, string filters = null)
        {
            var scope = AuthenticationService.GetScope(User);

            var queryOptions = new PolicyQueryOptions(scope, sortColumn, sortDirection, pageSize, pageNumber, filters);
            var pagedItems = await PolicyService.GetPolicies(queryOptions);

            return Ok(pagedItems);
        }

        [HttpGet("{policyId}")]
        [UseCaseAuthorize("clt_view_policies")]
        public async Task<IActionResult> Get(Guid policyId)
        {
            var scope = AuthenticationService.GetScope(User);

            var model = await PolicyService.GetPolicy(scope, policyId);

            if (model == null)
                return NotFound();

            return Ok(model);
        }

        [HttpPost]
        [UseCaseAuthorize("clt_edit_policies")]
        public async Task<IActionResult> Insert([FromBody] PolicyEdit policy)
        {
            var scope = AuthenticationService.GetScope(User);

            var result = await PolicyService.InsertPolicy(scope, policy);

            if (!result.Success)
                return BadRequest(result.ValidationFailures);

            return Ok(result);
        }

        [HttpPost("{policyId}")]
        [UseCaseAuthorize("clt_edit_policies")]
        public async Task<IActionResult> Update(Guid policyId, [FromBody] PolicyEdit policy)
        {
            policy.Id = policyId;

            var scope = AuthenticationService.GetScope(User);

            var result = await PolicyService.UpdatePolicy(scope, policy);

            if (!result.Success)
                return BadRequest(result.ValidationFailures);

            return Ok(result);
        }
    }

}
