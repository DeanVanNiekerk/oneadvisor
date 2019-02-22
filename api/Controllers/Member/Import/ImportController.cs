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
using api.Controllers.Member.Import.Dto;
using OneAdvisor.Model.Member.Model.ImportMember;

namespace api.Controllers.Directory.Import
{

    [ApiController]
    [Route("api/member/import")]
    public class ImportController : BaseController
    {
        public ImportController(IHttpContextAccessor contextAccessor, IMapper mapper, IMemberImportService memberImportService, IAuthenticationService authenticationService)
            : base(contextAccessor)
        {
            Mapper = mapper;
            MemberImportService = memberImportService;
            AuthenticationService = authenticationService;
        }

        private IMapper Mapper { get; }
        private IMemberImportService MemberImportService { get; }
        private IAuthenticationService AuthenticationService { get; }

        [HttpPost("")]
        [UseCaseAuthorize("mem_import_members")]
        public async Task<ActionResult<Result>> Import([FromBody] ImportMemberDto member)
        {
            var model = Mapper.Map<ImportMember>(member);

            var scope = await AuthenticationService.GetScope(UserId);

            var result = await MemberImportService.ImportMember(scope, model);

            result.Tag = null;

            if (!result.Success)
                return BadRequest(result.ValidationFailures);

            return Ok(result);
        }
    }
}
