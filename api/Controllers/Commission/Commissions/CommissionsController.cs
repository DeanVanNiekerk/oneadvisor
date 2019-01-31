﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using api.App.Authorization;
using OneAdvisor.Model.Common;
using api.App.Dtos;
using Microsoft.AspNetCore.Http;
using api.Controllers.Commission.Commissions.Dto;
using OneAdvisor.Model.Commission.Model.Commission;
using OneAdvisor.Model.Commission.Interface;
using OneAdvisor.Model.Directory.Interface;

namespace api.Controllers.Commission.Commissions
{

    [ApiController]
    [Route("api/commission/commissions")]
    public class CommissionsController : BaseController
    {
        public CommissionsController(IHttpContextAccessor contextAccessor, IMapper mapper, ICommissionService commissionService, IAuthService authService)
            : base(contextAccessor)
        {
            Mapper = mapper;
            CommissionService = commissionService;
            AuthService = authService;
        }

        private IMapper Mapper { get; }
        private ICommissionService CommissionService { get; }
        private IAuthService AuthService { get; }

        [HttpGet("")]
        [UseCaseAuthorize("com_view_commissions")]
        public async Task<PagedItemsDto<CommissionDto>> Index(string sortColumn, string sortDirection, int pageSize = 0, int pageNumber = 0, string filters = null)
        {
            var scope = await AuthService.GetScope(UserId, Scope);

            var queryOptions = new CommissionQueryOptions(scope, sortColumn, sortDirection, pageSize, pageNumber, filters);
            var pagedItems = await CommissionService.GetCommissions(queryOptions);

            return Mapper.MapToPageItemsDto<OneAdvisor.Model.Commission.Model.Commission.Commission, CommissionDto>(pagedItems);
        }

        [HttpGet("{commissionId}")]
        [UseCaseAuthorize("com_view_commissions")]
        public async Task<ActionResult<CommissionEditDto>> Get(Guid commissionId)
        {
            var scope = await AuthService.GetScope(UserId, Scope);

            var model = CommissionService.GetCommission(scope, commissionId).Result;

            if (model == null)
                return NotFound();

            return Ok(Mapper.Map<CommissionEditDto>(model));
        }

        [HttpPost]
        [UseCaseAuthorize("com_edit_commissions")]
        public async Task<ActionResult<Result>> Insert([FromBody] CommissionEditDto commission)
        {
            var scope = await AuthService.GetScope(UserId, Scope);

            var model = Mapper.Map<CommissionEdit>(commission);

            var result = await CommissionService.InsertCommission(scope, model);

            if (!result.Success)
                return BadRequest(result.ValidationFailures);

            return Ok(result);
        }

        [HttpPost("{commissionId}")]
        [UseCaseAuthorize("com_edit_commissions")]
        public async Task<ActionResult<Result>> Update(Guid commissionId, [FromBody] CommissionEditDto commission)
        {
            commission.Id = commissionId;

            var model = Mapper.Map<CommissionEdit>(commission);

            var scope = await AuthService.GetScope(UserId, Scope);

            var result = await CommissionService.UpdateCommission(scope, model);

            if (!result.Success)
                return BadRequest(result.ValidationFailures);

            return Ok(result);
        }
    }

}