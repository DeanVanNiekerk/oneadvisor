using System.Threading.Tasks;
using api.Controllers.Account.Authentication.Dto;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using OneAdvisor.Model.Directory.Interface;
using OneAdvisor.Model.Directory.Model.Authentication;

namespace api.Controllers.Account.Authentication
{
    [ApiController]
    [Route("api/account")]
    public class AuthenticationController : Controller
    {
        public AuthenticationController(IMapper mapper, IAuthenticationService authenticationService, IUseCaseService useCaseService, IOrganisationService organisationService, IBranchService branchService, IUserService userService, IOptions<JwtOptions> jwtOptions)
        {
            Mapper = mapper;
            UseCaseService = useCaseService;
            OrganisationService = organisationService;
            BranchService = branchService;
            AuthenticationService = authenticationService;
            UserService = userService;
            JwtOptions = jwtOptions.Value;
        }

        private IMapper Mapper { get; }
        private JwtOptions JwtOptions { get; }
        private IAuthenticationService AuthenticationService { get; }
        private IUseCaseService UseCaseService { get; }
        private IOrganisationService OrganisationService { get; }
        private IBranchService BranchService { get; }
        private IUserService UserService { get; }


        [AllowAnonymous]
        [HttpPost("[action]")]
        public async Task<IActionResult> SignIn([FromBody] CredentialsDto dto)
        {
            var result = await AuthenticationService.Authenticate(dto.Username, dto.Password);

            if (!result.Success)
                return BadRequest(new { error = true });

            var token = await AuthenticationService.GenerateToken(dto.Username, JwtOptions);

            var identity = Mapper.Map<Identity, IdentityDto>(result.Identity);

            return Ok(new { token = token, identity = identity });
        }
    }
}