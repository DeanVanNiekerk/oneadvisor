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
using OneAdvisor.Model.Member.Model.Member;
using Microsoft.AspNetCore.Http;
using OneAdvisor.Model.Directory.Interface;
using OneAdvisor.Model.Account.Interface;

namespace api.Controllers.Directory.Members
{

    [ApiController]
    [Route("api/member/members")]
    public class MembersController : Controller
    {
        public MembersController(IMemberService memberService, IAuthenticationService authenticationService)
        {
            MemberService = memberService;
            AuthenticationService = authenticationService;
        }

        private IMemberService MemberService { get; }
        private IAuthenticationService AuthenticationService { get; }

        [HttpGet("")]
        [UseCaseAuthorize("mem_view_members")]
        public async Task<IActionResult> Index(string sortColumn, string sortDirection, int pageSize = 0, int pageNumber = 0, string filters = null)
        {
            var scope = AuthenticationService.GetScope(User);

            var queryOptions = new MemberQueryOptions(scope, sortColumn, sortDirection, pageSize, pageNumber, filters);

            var members = await MemberService.GetMembers(queryOptions);

            return Ok(members);
        }

        [HttpGet("{memberId}")]
        [UseCaseAuthorize("mem_view_members")]
        public async Task<IActionResult> Get(Guid memberId)
        {
            var scope = AuthenticationService.GetScope(User);

            var model = await MemberService.GetMember(scope, memberId);

            if (model == null)
                return NotFound();

            return Ok(model);
        }

        [HttpGet("{memberId}/preview")]
        [UseCaseAuthorize("mem_view_members")]
        public async Task<IActionResult> GetPreview(Guid memberId)
        {
            var scope = AuthenticationService.GetScope(User);

            var model = await MemberService.GetMemberPreview(scope, memberId);

            if (model == null)
                return NotFound();

            return Ok(model);
        }

        [HttpPost]
        [UseCaseAuthorize("mem_edit_members")]
        public async Task<IActionResult> Insert([FromBody] MemberEdit member)
        {
            var scope = AuthenticationService.GetScope(User);

            var result = await MemberService.InsertMember(scope, member);

            if (!result.Success)
                return BadRequest(result.ValidationFailures);

            return Ok(result);
        }

        [HttpPost("{memberId}")]
        [UseCaseAuthorize("mem_edit_members")]
        public async Task<IActionResult> Update(Guid memberId, [FromBody] MemberEdit member)
        {
            member.Id = memberId;

            var scope = AuthenticationService.GetScope(User);

            var result = await MemberService.UpdateMember(scope, member);

            if (!result.Success)
                return BadRequest(result.ValidationFailures);

            return Ok(result);
        }

        [HttpDelete("{memberId}")]
        [UseCaseAuthorize("mem_edit_members")]
        public async Task<IActionResult> Delete(Guid memberId)
        {
            var scope = AuthenticationService.GetScope(User);

            var result = await MemberService.DeleteMember(scope, memberId);

            if (!result.Success)
                return BadRequest(result.ValidationFailures);

            return Ok(result);
        }
    }
}
