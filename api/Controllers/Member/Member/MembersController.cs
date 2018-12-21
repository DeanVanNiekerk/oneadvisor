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
using api.Controllers.Directory.Members.Dto;
using OneAdvisor.Model.Member.Model.Member;
using Microsoft.AspNetCore.Http;
using OneAdvisor.Model.Directory.Interface;

namespace api.Controllers.Directory.Members
{

    [ApiController]
    [Route("api/member/members")]
    public class MembersController : BaseController
    {
        public MembersController(IHttpContextAccessor contextAccessor, IMapper mapper, IMemberService memberService, IAuthService authService)
            : base(contextAccessor)
        {
            Mapper = mapper;
            MemberService = memberService;
            AuthService = authService;
        }

        private IMapper Mapper { get; }
        private IMemberService MemberService { get; }
        private IAuthService AuthService { get; }

        [HttpGet("")]
        [UseCaseAuthorize("mem_view_members_user", "mem_view_members_branch", "mem_view_members_organisation")]
        public async Task<PagedItemsDto<MemberDto>> Index(string sortColumn, string sortDirection, int pageSize = 0, int pageNumber = 0, string filters = null)
        {
            var scope = await AuthService.GetScope(UserId, RoleIds, "mem_view_members_branch", "mem_view_members_organisation");

            var queryOptions = new MemberQueryOptions(scope, sortColumn, sortDirection, pageSize, pageNumber, filters);
            var pagedItems = await MemberService.GetMembers(queryOptions);

            return Mapper.MapToPageItemsDto<OneAdvisor.Model.Member.Model.Member.Member, MemberDto>(pagedItems);
        }

        [HttpGet("{memberId}")]
        [UseCaseAuthorize("mem_view_members_user", "mem_view_members_branch", "mem_view_members_organisation")]
        public async Task<ActionResult<MemberEditDto>> Get(Guid memberId)
        {
            var scope = await AuthService.GetScope(UserId, RoleIds, "mem_view_members_branch", "mem_view_members_organisation");

            var model = MemberService.GetMember(scope, memberId).Result;

            if (model == null)
                return NotFound();

            return Ok(Mapper.Map<MemberEditDto>(model));
        }

        [HttpPost]
        [UseCaseAuthorize("mem_edit_members_user")]
        public async Task<ActionResult<Result>> Insert([FromBody] MemberEditDto member)
        {
            var model = Mapper.Map<MemberEdit>(member);

            var result = await MemberService.InsertMember(UserId, model);

            if (!result.Success)
                return BadRequest(result.ValidationFailures);

            return Ok(result);
        }

        [HttpPost("{memberId}")]
        [UseCaseAuthorize("mem_edit_members_user")]
        public async Task<ActionResult<Result>> Update(Guid memberId, [FromBody] MemberEditDto member)
        {
            member.Id = memberId;

            var model = Mapper.Map<MemberEdit>(member);

            var scope = await AuthService.GetScope(UserId, RoleIds);

            var result = await MemberService.UpdateMember(scope, model);

            if (!result.Success)
                return BadRequest(result.ValidationFailures);

            return Ok(result);
        }
    }

}
