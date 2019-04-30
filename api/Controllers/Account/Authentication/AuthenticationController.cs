using System.Threading.Tasks;
using api.App.Models;
using api.App.Token;
using api.Controllers.Account.Authentication.Dto;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using OneAdvisor.Model;
using OneAdvisor.Model.Account.Interface;
using OneAdvisor.Model.Account.Model.Account;
using OneAdvisor.Model.Account.Model.Authentication;
using OneAdvisor.Model.Common;
using OneAdvisor.Model.Directory.Interface;
using OneAdvisor.Model.Email;

namespace api.Controllers.Account.Authentication
{
    [ApiController]
    [Route("api/account")]
    public class AuthenticationController : Controller
    {
        public AuthenticationController(IAuthenticationService authenticationService, IEmailService emailService, IUserService userService, IOptions<JwtOptions> jwtOptions, IOptions<AppOptions> appOptions)
        {
            EmailService = emailService;
            AuthenticationService = authenticationService;
            UserService = userService;
            JwtOptions = jwtOptions.Value;
            AppOptions = appOptions.Value;
        }

        private IAuthenticationService AuthenticationService { get; }
        private IEmailService EmailService { get; }
        private IUserService UserService { get; }
        private JwtOptions JwtOptions { get; }
        private AppOptions AppOptions { get; }


        [AllowAnonymous]
        [HttpPost("signin")]
        public async Task<IActionResult> SignIn([FromBody] CredentialsDto dto)
        {
            var result = await AuthenticationService.Authenticate(dto.UserName, dto.Password);

            if (!result.Success)
                return BadRequest(new Result("Invalid Username or Password"));

            var token = await AuthenticationService.GenerateToken(dto.UserName, JwtOptions);

            return Ok(new { token = token });
        }

        [AllowAnonymous]
        [HttpPost("resetPasswordRequest")]
        public async Task<IActionResult> ResetPasswordRequest([FromBody] ResetPasswordRequest model)
        {
            var result = await AuthenticationService.GeneratePasswordResetToken(model.UserName);

            if (!result.Success)
                return Ok(new Result(true)); //No phishing for usernames....

            var scope = AuthenticationService.GetIgnoreScope();
            var user = await UserService.GetUser(scope, model.UserName);

            var token = (string)result.Tag;
            var url = UrlHelper.GenerateResetPasswordLink(AppOptions, token, model.UserName);

            result = await EmailService.SendResetPasswordEmail(user, url);

            if (!result.Success)
                return StatusCode(500, result);

            return Ok(result);
        }

        [AllowAnonymous]
        [HttpPost("activate")]
        public async Task<IActionResult> Activate([FromBody] ResetPassword model)
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

        [AllowAnonymous]
        [HttpPost("resetPassword")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPassword model)
        {
            var result = await AuthenticationService.ResetPassword(model);

            if (!result.Success)
                return BadRequest(result.ValidationFailures);

            result.Tag = await AuthenticationService.GenerateToken(model.UserName, JwtOptions);

            return Ok(result);
        }
    }
}