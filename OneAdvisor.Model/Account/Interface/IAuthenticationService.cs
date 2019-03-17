using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using OneAdvisor.Model.Account.Model.Account;
using OneAdvisor.Model.Account.Model.Authentication;
using OneAdvisor.Model.Common;

namespace OneAdvisor.Model.Account.Interface
{
    public interface IAuthenticationService
    {
        ScopeOptions GetScope(ClaimsPrincipal principle, bool ignoreScope = false);
        Task<AuthenticationResult> Authenticate(string userName, string password);
        Task<string> GenerateToken(string userName, JwtOptions options);
        Task<string> GeneratePasswordResetToken(string userName);
        Task<Result> ResetPassword(ResetPassword resetPassword);
        Task<bool> IsUserActive(string userName);
    }
}