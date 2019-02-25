using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using api.App.Authorization;
using OneAdvisor.Model.Directory.Interface;
using api.Controllers.Directory.Branches.Dto;
using OneAdvisor.Model.Common;
using api.App.Dtos;
using OneAdvisor.Model.Directory.Model.Branch;
using Microsoft.AspNetCore.Http;
using OneAdvisor.Model.Account.Interface;

namespace api.Controllers.Directory.Branches
{

    [ApiController]
    [Route("api/directory/branches")]
    public class BranchesController : Controller
    {
        public BranchesController(IMapper mapper, IAuthenticationService authenticationService, IBranchService branchService)
        {
            Mapper = mapper;
            BranchService = branchService;
            AuthenticationService = authenticationService;
        }

        private IMapper Mapper { get; }
        private IBranchService BranchService { get; }
        private IAuthenticationService AuthenticationService { get; }

        [HttpGet("")]
        [UseCaseAuthorize("dir_view_branches")]
        public async Task<PagedItemsDto<BranchDto>> Index(string filters = null)
        {
            var scope = AuthenticationService.GetScope(User, true);

            var queryOptions = new BranchQueryOptions(scope, filters);
            var pagedItems = await BranchService.GetBranches(queryOptions);

            return Mapper.MapToPageItemsDto<Branch, BranchDto>(pagedItems);
        }

        [HttpGet("{branchId}")]
        [UseCaseAuthorize("dir_view_branches")]
        public async Task<ActionResult<BranchDto>> Get(Guid branchId)
        {
            var scope = AuthenticationService.GetScope(User, true);

            var model = await BranchService.GetBranch(scope, branchId);

            if (model == null)
                return NotFound();

            return Ok(Mapper.Map<BranchDto>(model));
        }

        [HttpPost]
        [UseCaseAuthorize("dir_edit_branches")]
        public async Task<ActionResult<Result>> Insert([FromBody] BranchDto branch)
        {
            var scope = AuthenticationService.GetScope(User, true);

            var model = Mapper.Map<Branch>(branch);

            var result = await BranchService.InsertBranch(scope, model);

            if (!result.Success)
                return BadRequest(result.ValidationFailures);

            return Ok(result);
        }

        [HttpPost("{branchId}")]
        [UseCaseAuthorize("dir_edit_branches")]
        public async Task<ActionResult<Result>> Update(Guid branchId, [FromBody] BranchDto branch)
        {
            var scope = AuthenticationService.GetScope(User, true);

            branch.Id = branchId;

            var model = Mapper.Map<Branch>(branch);

            var result = await BranchService.UpdateBranch(scope, model);

            if (!result.Success)
                return BadRequest(result.ValidationFailures);

            return Ok(result);
        }
    }

}
