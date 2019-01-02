
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using OneAdvisor.Model.Directory.Model.User;

namespace api.App.Authorization
{
    public class Context
    {
        public static Identity GetIdentity(ClaimsPrincipal principal)
        {
            return new Identity()
            {
                Id = GetUserId(principal),
                Name = TryGetClaimValue(principal, ClaimTypes.Name),
                BranchId = GetBranchId(principal),
                RoleIds = GetRoleIds(principal),
                AssistantToUserId = GetAssistantToUserId(principal),
                Scope = GetScope(principal)
            };
        }

        public static Guid GetBranchId(ClaimsPrincipal principal)
        {
            return TryGetClaimValueAsGuid(principal, "branchid");
        }

        public static Scope GetScope(ClaimsPrincipal principal)
        {
            var scope = TryGetClaimValue(principal, "scopelevel");

            return ScopeParser.Parse(scope);
        }

        public static string GetAssistantToUserId(ClaimsPrincipal principal)
        {
            return TryGetClaimValue(principal, "assistantToUserId");
        }

        public static string GetUserId(ClaimsPrincipal principal)
        {
            return TryGetClaimValue(principal, ClaimTypes.NameIdentifier);
        }

        public static Guid TryGetClaimValueAsGuid(ClaimsPrincipal principal, string claimType)
        {
            var guid = TryGetClaimValue(principal, claimType);
            if (string.IsNullOrEmpty(guid))
                return Guid.Empty;
            return Guid.Parse(guid);
        }

        public static string TryGetClaimValue(ClaimsPrincipal principal, string claimType)
        {
            if (principal == null || principal.Claims == null)
                return "";

            var claim = principal.Claims.FirstOrDefault(c => c.Type == claimType);
            if (claim != null)
                return claim.Value;
            return "";
        }

        public static IEnumerable<string> GetRoleIds(ClaimsPrincipal principal)
        {
            if (principal == null || principal.Claims == null)
                return new List<string>();

            return principal.Claims.Where(c => c.Type == ClaimTypes.Role).Select(c => c.Value);
        }

    }
}