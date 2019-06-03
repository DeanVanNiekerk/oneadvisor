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
using OneAdvisor.Model.Commission.Model.CommissionSplitRule;

namespace api.Controllers.Commission.CommissionSplitRules
{
    [ApiController]
    [Route("api/commission/splitRules")]
    public class CommissionSplitRulesController : Controller
    {
        public CommissionSplitRulesController(ICommissionSplitService commissionSplitService, IAuthenticationService authenticationService)
        {
            CommissionSplitService = commissionSplitService;
            AuthenticationService = authenticationService;
        }

        private ICommissionSplitService CommissionSplitService { get; }
        private IAuthenticationService AuthenticationService { get; }

        [HttpGet("")]
        [UseCaseAuthorize("com_view_commission_split_rules")]
        public async Task<IActionResult> Index(string sortColumn, string sortDirection, int pageSize = 0, int pageNumber = 0, string filters = null)
        {
            var scope = AuthenticationService.GetScope(User);

            var queryOptions = new CommissionSplitRuleQueryOptions(scope, sortColumn, sortDirection, pageSize, pageNumber, filters);

            var commissions = await CommissionSplitService.GetCommissionSplitRules(queryOptions);

            return Ok(commissions);
        }

        [HttpGet("{commissionSplitRuleId}")]
        [UseCaseAuthorize("com_view_commission_split_rules")]
        public async Task<IActionResult> Get(Guid commissionSplitRuleId)
        {
            var scope = AuthenticationService.GetScope(User);

            var model = await CommissionSplitService.GetCommissionSplitRule(scope, commissionSplitRuleId);

            if (model == null)
                return NotFound();

            return Ok(model);
        }

        [HttpPost]
        [UseCaseAuthorize("com_edit_commission_split_rules")]
        public async Task<IActionResult> Insert([FromBody] CommissionSplitRule commissionSplitRule)
        {
            var scope = AuthenticationService.GetScope(User);

            var result = await CommissionSplitService.InsertCommissionSplitRule(scope, commissionSplitRule);

            if (!result.Success)
                return BadRequest(result.ValidationFailures);

            return Ok(result);
        }

        [HttpPost("{commissionSplitRuleId}")]
        [UseCaseAuthorize("com_edit_commission_split_rules")]
        public async Task<IActionResult> Update(Guid commissionSplitRuleId, [FromBody] CommissionSplitRule commissionSplitRule)
        {
            commissionSplitRule.Id = commissionSplitRuleId;

            var scope = AuthenticationService.GetScope(User);

            var result = await CommissionSplitService.UpdateCommissionSplitRule(scope, commissionSplitRule);

            if (!result.Success)
                return BadRequest(result.ValidationFailures);

            return Ok(result);
        }

        [HttpDelete("{commissionSplitRuleId}")]
        [UseCaseAuthorize("com_edit_commission_split_rules")]
        public async Task<IActionResult> Delete(Guid commissionSplitRuleId)
        {
            var scope = AuthenticationService.GetScope(User);

            var result = await CommissionSplitService.DeleteCommissionSplitRule(scope, commissionSplitRuleId);

            if (!result.Success)
                return BadRequest(result.ValidationFailures);

            return Ok(result);
        }
    }

}
