using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using OneAdvisor.Model.Account.Model.Account;
using OneAdvisor.Model.Account.Model.Authentication;
using OneAdvisor.Model.Common;
using OneAdvisor.Model.Config.Options;

namespace OneAdvisor.Model.Account.Interface
{
    public interface IAuthenticationService
    {
        ScopeOptions GetScope(ClaimsPrincipal principle, bool ignoreScope = false);
        ScopeOptions GetIgnoreScope();
        Task<AuthenticationResult> Authenticate(string userName, string password);
        Task<string> GenerateToken(string userName, JwtOptions options);
        Task<string> GenerateToken(string userName, Guid? organisationId, JwtOptions options);
        Task<Result> GeneratePasswordResetToken(string userName);
        Task<Result> ResetPassword(ResetPassword resetPassword);
        Task<bool> IsUserActive(string userName);
    }
}