using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using api.App.Middleware;
using FluentValidation.Results;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Mvc;
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

        public static BadRequestObjectResult BadRequest(this Controller controller, string message)
        {
            return controller.BadRequest(new List<ValidationFailure>() { new ValidationFailure("", message) });
        }
    }
}