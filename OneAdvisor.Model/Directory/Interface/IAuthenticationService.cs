using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using OneAdvisor.Model.Directory.Model.Authentication;
using OneAdvisor.Model.Directory.Model.Role;
using OneAdvisor.Model.Directory.Model.User;

namespace OneAdvisor.Model.Directory.Interface
{
    public interface IAuthenticationService
    {
        ScopeOptions GetScope(ClaimsPrincipal principle, bool ignoreScope = false);
        Task<AuthenticationResult> Authenticate(string userName, string password);
        Task<string> GenerateToken(string userName, JwtOptions options);
    }
}