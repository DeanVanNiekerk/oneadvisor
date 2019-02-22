using System.Threading.Tasks;
using api.Controllers.Directory.Authentication.Dto;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using OneAdvisor.Model.Directory.Interface;
using OneAdvisor.Model.Directory.Model.Authentication;

namespace api.Controllers.Directory.Authentication
{
    public class AuthenticationController : Controller
    {
        public AuthenticationController(IAuthenticationService authenticationService, IOptions<JwtOptions> jwtOptions)
        {
            AuthenticationService = authenticationService;
            JwtOptions = jwtOptions.Value;
        }

        private IAuthenticationService AuthenticationService { get; }
        private JwtOptions JwtOptions { get; }

        [AllowAnonymous]
        [HttpPost("[action]")]
        public async Task<IActionResult> SignIn([FromBody] CredentialsDto dto)
        {
            var result = await AuthenticationService.Authenticate(dto.Username, dto.Password);

            if (!result.Success)
                return BadRequest(new { error = true });

            var token = await AuthenticationService.GenerateToken(dto.Username, JwtOptions);

            return Ok(new { token = token });
        }
    }
}