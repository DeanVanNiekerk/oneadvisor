using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using api.App.Authorization;
using OneAdvisor.Model.Common;
using OneAdvisor.Model.Member.Interface;
using api.App.Dtos;
using Microsoft.AspNetCore.Http;
using OneAdvisor.Model.Directory.Interface;
using api.Controllers.Member.Policies.Dto;
using OneAdvisor.Model.Member.Model.Policy;

namespace api.Controllers.Member.Members
{

    [ApiController]
    [Route("api/member/policies")]
    public class PoliciesController : Controller
    {
        public PoliciesController(IMapper mapper, IPolicyService policyService, IAuthenticationService authenticationService)
        {
            Mapper = mapper;
            PolicyService = policyService;
            AuthenticationService = authenticationService;
        }

        private IMapper Mapper { get; }
        private IPolicyService PolicyService { get; }
        private IAuthenticationService AuthenticationService { get; }

        [HttpGet("")]
        [UseCaseAuthorize("mem_view_policies")]
        public async Task<PagedItemsDto<PolicyDto>> Index(string sortColumn, string sortDirection, int pageSize = 0, int pageNumber = 0, string filters = null)
        {
            var scope = AuthenticationService.GetScope(User);

            var queryOptions = new PolicyQueryOptions(scope, sortColumn, sortDirection, pageSize, pageNumber, filters);
            var pagedItems = await PolicyService.GetPolicies(queryOptions);

            return Mapper.MapToPageItemsDto<Policy, PolicyDto>(pagedItems);
        }

        [HttpGet("{policyId}")]
        [UseCaseAuthorize("mem_view_policies")]
        public async Task<ActionResult<PolicyEditDto>> Get(Guid policyId)
        {
            var scope = AuthenticationService.GetScope(User);

            var model = await PolicyService.GetPolicy(scope, policyId);

            if (model == null)
                return NotFound();

            return Ok(Mapper.Map<PolicyEditDto>(model));
        }

        [HttpPost]
        [UseCaseAuthorize("mem_edit_policies")]
        public async Task<ActionResult<Result>> Insert([FromBody] PolicyEditDto policy)
        {
            var scope = AuthenticationService.GetScope(User);

            var model = Mapper.Map<PolicyEdit>(policy);

            var result = await PolicyService.InsertPolicy(scope, model);

            if (!result.Success)
                return BadRequest(result.ValidationFailures);

            return Ok(result);
        }

        [HttpPost("{policyId}")]
        [UseCaseAuthorize("mem_edit_policies")]
        public async Task<ActionResult<Result>> Update(Guid policyId, [FromBody] PolicyEditDto policy)
        {
            policy.Id = policyId;

            var model = Mapper.Map<PolicyEdit>(policy);

            var scope = AuthenticationService.GetScope(User);

            var result = await PolicyService.UpdatePolicy(scope, model);

            if (!result.Success)
                return BadRequest(result.ValidationFailures);

            return Ok(result);
        }
    }

}
