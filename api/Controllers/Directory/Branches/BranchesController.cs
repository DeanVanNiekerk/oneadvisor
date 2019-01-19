﻿using System;
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

namespace api.Controllers.Directory.Branches
{

    [ApiController]
    [Route("api/directory/branches")]
    public class BranchesController : BaseController
    {
        public BranchesController(IHttpContextAccessor contextAccessor, IMapper mapper, IAuthService authService, IBranchService branchService)
            : base(contextAccessor)
        {
            Mapper = mapper;
            BranchService = branchService;
            AuthService = authService;
        }

        private IMapper Mapper { get; }
        private IBranchService BranchService { get; }
        private IAuthService AuthService { get; }

        [HttpGet("")]
        [UseCaseAuthorize("dir_view_branches")]
        public async Task<PagedItemsDto<BranchDto>> Index(string filters = null)
        {
            var scope = await AuthService.GetScope(UserId, Scope, IsSuperAdmin);

            var queryOptions = new BranchQueryOptions(scope, filters);
            var pagedItems = await BranchService.GetBranches(queryOptions);

            return Mapper.MapToPageItemsDto<Branch, BranchDto>(pagedItems);
        }

        [HttpGet("{branchId}")]
        [UseCaseAuthorize("dir_view_branches")]
        public async Task<ActionResult<BranchDto>> Get(Guid branchId)
        {
            var scope = await AuthService.GetScope(UserId, Scope, IsSuperAdmin);

            var model = await BranchService.GetBranch(scope, branchId);

            if (model == null)
                return NotFound();

            return Ok(Mapper.Map<BranchDto>(model));
        }

        [HttpPost]
        [UseCaseAuthorize("dir_edit_branches")]
        public async Task<ActionResult<Result>> Insert([FromBody] BranchDto branch)
        {
            var scope = await AuthService.GetScope(UserId, Scope, IsSuperAdmin);

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
            var scope = await AuthService.GetScope(UserId, Scope, IsSuperAdmin);

            branch.Id = branchId;

            var model = Mapper.Map<Branch>(branch);

            var result = await BranchService.UpdateBranch(scope, model);

            if (!result.Success)
                return BadRequest(result.ValidationFailures);

            return Ok(result);
        }
    }

}
