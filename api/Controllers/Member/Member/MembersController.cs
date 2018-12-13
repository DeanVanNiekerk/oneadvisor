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

namespace api.Controllers.Directory.Members
{

    [ApiController]
    [Route("api/member/members")]
    public class MembersController : Controller
    {
        public MembersController(IMapper mapper, IMemberService memberService)
        {
            Mapper = mapper;
            MemberService = memberService;
        }

        private IMapper Mapper { get; }
        private IMemberService MemberService { get; }

        [HttpGet("")]
        [UseCaseAuthorize("mem_view_members")]
        public async Task<PagedItemsDto<MemberDto>> Index(string sortColumn, string sortDirection, int pageSize = 0, int pageNumber = 0)
        {
            var queryOptions = new MemberQueryOptions(sortColumn, sortDirection, pageSize, pageNumber);
            var pagedItems = await MemberService.GetMembers(queryOptions);

            return Mapper.MapToPageItemsDto<OneAdvisor.Model.Member.Model.Member.Member, MemberDto>(pagedItems);
        }

        [HttpGet("{memberId}")]
        [UseCaseAuthorize("mem_view_members")]
        public ActionResult<MemberEditDto> Get(Guid memberId)
        {
            var model = MemberService.GetMember(memberId).Result;

            if (model == null)
                return NotFound();

            return Ok(Mapper.Map<MemberEditDto>(model));
        }

        [HttpPost]
        [UseCaseAuthorize("mem_edit_members")]
        public async Task<ActionResult<Result>> Insert([FromBody] MemberEditDto member)
        {
            var model = Mapper.Map<MemberEdit>(member);

            var result = await MemberService.InsertMember(model);

            if (!result.Success)
                return BadRequest(result.ValidationFailures);

            return Ok(result);
        }

        [HttpPost("{memberId}")]
        [UseCaseAuthorize("mem_edit_members")]
        public async Task<ActionResult<Result>> Update(Guid memberId, [FromBody] MemberEditDto member)
        {
            member.Id = memberId;

            var model = Mapper.Map<MemberEdit>(member);

            var result = await MemberService.UpdateMember(model);

            if (!result.Success)
                return BadRequest(result.ValidationFailures);

            return Ok(result);
        }
    }

}
