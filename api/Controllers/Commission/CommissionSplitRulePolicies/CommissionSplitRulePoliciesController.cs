using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using api.App.Authorization;
using OneAdvisor.Model.Common;
using Microsoft.AspNetCore.Http;
using OneAdvisor.Model.Account.Interface;
using OneAdvisor.Model.Commission.Interface;
using OneAdvisor.Model.Commission.Model.CommissionSplitRulePolicy;

namespace api.Controllers.Commission.CommissionSplitRules
{
    [ApiController]
    [Route("api/commission/splitRulePolicies")]
    public class CommissionSplitRulePoliciesController : Controller
    {
        public CommissionSplitRulePoliciesController(ICommissionSplitRulePolicyService commissionSplitRulePolicyService, IAuthenticationService authenticationService)
        {
            CommissionSplitRulePolicyService = commissionSplitRulePolicyService;
            AuthenticationService = authenticationService;
        }

        private ICommissionSplitRulePolicyService CommissionSplitRulePolicyService { get; }
        private IAuthenticationService AuthenticationService { get; }

        [HttpGet("")]
        [UseCaseAuthorize("com_view_commission_split_rules")]
        public async Task<IActionResult> Index(string sortColumn, string sortDirection, int pageSize = 0, int pageNumber = 0, string filters = null)
        {
            var scope = AuthenticationService.GetScope(User);

            var queryOptions = new CommissionSplitRulePolicyInfoQueryOptions(scope, sortColumn, sortDirection, pageSize, pageNumber, filters);

            var commissions = await CommissionSplitRulePolicyService.GetCommissionSplitRulePolicies(queryOptions);

            return Ok(commissions);
        }

        [HttpGet("{policyId}")]
        [UseCaseAuthorize("com_view_commission_split_rules")]
        public async Task<IActionResult> Get(Guid policyId)
        {
            var scope = AuthenticationService.GetScope(User);

            var model = await CommissionSplitRulePolicyService.GetCommissionSplitRulePolicy(scope, policyId);

            if (model == null)
                return NotFound();

            return Ok(model);
        }

        [HttpPost]
        [UseCaseAuthorize("com_edit_commission_split_rules")]
        public async Task<IActionResult> Insert([FromBody] CommissionSplitRulePolicy commissionSplitRulePolicy)
        {
            var scope = AuthenticationService.GetScope(User);

            var result = await CommissionSplitRulePolicyService.InsertCommissionSplitRulePolicy(scope, commissionSplitRulePolicy);

            if (!result.Success)
                return BadRequest(result.ValidationFailures);

            return Ok(result);
        }

        [HttpPost("{commissionSplitRulePolicyId}")]
        [UseCaseAuthorize("com_edit_commission_split_rules")]
        public async Task<IActionResult> Update(Guid commissionSplitRulePolicyId, [FromBody] CommissionSplitRulePolicy commissionSplitRulePolicy)
        {
            commissionSplitRulePolicy.Id = commissionSplitRulePolicyId;

            var scope = AuthenticationService.GetScope(User);

            var result = await CommissionSplitRulePolicyService.UpdateCommissionSplitRulePolicy(scope, commissionSplitRulePolicy);

            if (!result.Success)
                return BadRequest(result.ValidationFailures);

            return Ok(result);
        }

        [HttpDelete("{commissionSplitRulePolicyId}")]
        [UseCaseAuthorize("com_edit_commission_split_rules")]
        public async Task<IActionResult> Delete(Guid commissionSplitRulePolicyId)
        {
            var scope = AuthenticationService.GetScope(User);

            var result = await CommissionSplitRulePolicyService.DeleteCommissionSplitRulePolicy(scope, commissionSplitRulePolicyId);

            if (!result.Success)
                return BadRequest(result.ValidationFailures);

            return Ok(result);
        }
    }

}
