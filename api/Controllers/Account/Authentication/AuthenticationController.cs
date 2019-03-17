using System.Threading.Tasks;
using api.Controllers.Account.Authentication.Dto;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using OneAdvisor.Model;
using OneAdvisor.Model.Account.Interface;
using OneAdvisor.Model.Account.Model.Account;
using OneAdvisor.Model.Account.Model.Authentication;
using OneAdvisor.Model.Common;
using OneAdvisor.Model.Directory.Interface;

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
        [HttpPost("signin")]
        public async Task<ActionResult<Result>> SignIn([FromBody] CredentialsDto dto)
        {
            var result = await AuthenticationService.Authenticate(dto.UserName, dto.Password);

            if (!result.Success)
                return BadRequest(new Result("Invalid Username or Password"));

            var token = await AuthenticationService.GenerateToken(dto.UserName, JwtOptions);

            return Ok(new { token = token });
        }

        [AllowAnonymous]
        [HttpPost("resetPassword")]
        public async Task<ActionResult<Result>> ResetPassword([FromBody] ResetPassword model)
        {
            var isActivate = await AuthenticationService.IsUserActive(model.UserName);

            if (isActivate)
                return BadRequest(new Result("", "User Account has already been activated").ValidationFailures);

            var result = await AuthenticationService.ResetPassword(model);

            if (!result.Success)
                return BadRequest(result.ValidationFailures);

            result.Tag = await AuthenticationService.GenerateToken(model.UserName, JwtOptions);

            return Ok(result);
        }
    }
}