using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using api.App.Authorization;
using OneAdvisor.Model.Directory.Interface;
using OneAdvisor.Model.Common;
using OneAdvisor.Model.Directory.Model.Branch;
using Microsoft.AspNetCore.Http;
using OneAdvisor.Model.Account.Interface;

namespace api.Controllers.Directory.Branches
{

    [ApiController]
    [Route("api/directory/branches")]
    public class BranchesController : Controller
    {
        public BranchesController(IBranchService branchService, IAuthenticationService authenticationService)
        {
            BranchService = branchService;
            AuthenticationService = authenticationService;
        }

        private IBranchService BranchService { get; }
        private IAuthenticationService AuthenticationService { get; }

        [HttpGet("")]
        [UseCaseAuthorize("dir_view_branches")]
        public async Task<IActionResult> Index(string filters = null)
        {
            var scope = AuthenticationService.GetScope(User, User.IsSuperAdmin());

            var queryOptions = new BranchQueryOptions(scope, filters);
            var pagedItems = await BranchService.GetBranches(queryOptions);

            return Ok(pagedItems);
        }

        [HttpGet("{branchId}")]
        [UseCaseAuthorize("dir_view_branches")]
        public async Task<IActionResult> Get(Guid branchId)
        {
            var scope = AuthenticationService.GetScope(User, User.IsSuperAdmin());

            var model = await BranchService.GetBranch(scope, branchId);

            if (model == null)
                return NotFound();

            return Ok(model);
        }

        [HttpPost]
        [UseCaseAuthorize("dir_edit_branches")]
        public async Task<IActionResult> Insert([FromBody] Branch branch)
        {
            var scope = AuthenticationService.GetScope(User, User.IsSuperAdmin());

            var result = await BranchService.InsertBranch(scope, branch);

            if (!result.Success)
                return BadRequest(result.ValidationFailures);

            return Ok(result);
        }

        [HttpPost("{branchId}")]
        [UseCaseAuthorize("dir_edit_branches")]
        public async Task<IActionResult> Update(Guid branchId, [FromBody] Branch branch)
        {
            var scope = AuthenticationService.GetScope(User, User.IsSuperAdmin());

            branch.Id = branchId;

            var result = await BranchService.UpdateBranch(scope, branch);

            if (!result.Success)
                return BadRequest(result.ValidationFailures);

            return Ok(result);
        }
    }

}
