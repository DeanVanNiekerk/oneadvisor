using System;
using System.Threading.Tasks;
using api.App.Models;
using api.App.Token;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using OneAdvisor.Model.Account.Interface;
using OneAdvisor.Model.Common;
using OneAdvisor.Model.Directory.Interface;
using OneAdvisor.Model.Email;

namespace api.Controllers.Email
{
    [ApiController]
    [Route("api/email")]
    public class EmailController : Controller
    {
        public EmailController(IAuthenticationService authenticationService, IEmailService emailService, IUserService userService, IOptions<AppOptions> appOptions)
        {
            AuthenticationService = authenticationService;
            EmailService = emailService;
            UserService = userService;
            AppOptions = appOptions.Value;
        }

        private IAuthenticationService AuthenticationService { get; }
        private IEmailService EmailService { get; }
        private IUserService UserService { get; }
        private AppOptions AppOptions { get; }


        [HttpGet("sendWelcomeEmail")]
        public async Task<ActionResult> SendWelcomeEmail([FromQuery] Guid userId)
        {
            var scope = AuthenticationService.GetScope(User, User.IsSuperAdmin());

            var user = await UserService.GetUser(scope, userId);

            if (user == null)
                return NotFound();

            var token = await AuthenticationService.GeneratePasswordResetToken(user.UserName);
            var url = UrlHelper.GenerateActivateLink(AppOptions, token, user);

            var result = await EmailService.SendWelcomeEmail(user, url);

            if (!result.Success)
                return StatusCode(500, result);

            return Ok(result);
        }
    }
}