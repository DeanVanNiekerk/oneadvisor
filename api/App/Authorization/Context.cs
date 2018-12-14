
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;

namespace api.App.Authorization
{
    public class Context
    {
        public static Identity GetIdentity(ClaimsPrincipal principal)
        {
            return new Identity()
            {
                Id = TryGetClaimValue(principal, ClaimTypes.NameIdentifier),
                FirstName = TryGetClaimValue(principal, ClaimTypes.GivenName),
                LastName = TryGetClaimValue(principal, ClaimTypes.Surname),
                OrganisationId = TryGetClaimValueAsGuid(principal, "organisation"),
                RoleIds = GetRoleIds(principal)
            };
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
            var claim = principal.Claims.FirstOrDefault(c => c.Type == claimType);
            if (claim != null)
                return claim.Value;
            return "";
        }

        public static IEnumerable<string> GetRoleIds(ClaimsPrincipal principal)
        {
            return principal.Claims.Where(c => c.Type == ClaimTypes.Role).Select(c => c.Value);
        }

    }
}