using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using api.App.Dtos;
using api.App.Middleware;
using Microsoft.AspNetCore.Builder;
using OneAdvisor.Model.Common;
using OneAdvisor.Model.Directory.Model.Role;

namespace api
{
    public static class ExtensionMethods
    {
        public static IApplicationBuilder UseMaintainCorsHeader(this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<MaintainCorsHeader>();
        }

        public static bool IsSuperAdmin(this ClaimsPrincipal principal)
        {
            var roles = principal.Claims.Where(c => c.Type == ClaimTypes.Role).Select(c => c.Value);

            return roles.Any(r => r == Role.SUPER_ADMINISTRATOR_ROLE);
        }
    }
}