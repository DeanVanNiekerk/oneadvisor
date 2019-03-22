using System.Threading.Tasks;
using api.App.Authorization;
using Microsoft.AspNetCore.Mvc;
using OneAdvisor.Model.Account.Interface;
using OneAdvisor.Model.Member.Interface;
using OneAdvisor.Model.Member.Model.Merge;

namespace api.Controllers.Member.Merge
{
    [ApiController]
    [Route("api/member/merge")]
    public class MergeController : Controller
    {
        public MergeController(IMemberService memberService, IAuthenticationService authenticationService)
        {
            MemberService = memberService;
            AuthenticationService = authenticationService;
        }

        private IMemberService MemberService { get; }
        private IAuthenticationService AuthenticationService { get; }

        [HttpPost]
        [UseCaseAuthorize("mem_edit_members")]
        public async Task<IActionResult> Merge([FromBody] MergeMembers merge)
        {
            var scope = AuthenticationService.GetScope(User);

            var result = await MemberService.MergeMembers(scope, merge);

            if (!result.Success)
                return BadRequest(result.ValidationFailures);

            return Ok(result);
        }

    }
}