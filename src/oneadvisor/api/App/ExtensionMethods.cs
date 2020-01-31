using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using FluentValidation.Results;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Mvc;
using OneAdvisor.Model.Account.Model.Authentication;
using OneAdvisor.Model.Directory.Model.Role;

namespace api
{
    public static class ExtensionMethods
    {
        public static IApplicationBuilder UseHealthCheck(this IApplicationBuilder builder)
        {
            return builder.UseHealthChecks("/healthcheck");
        }

        public static bool IsSuperAdmin(this ClaimsPrincipal principal)
        {
            var roles = principal.Claims.Where(c => c.Type == Claims.RolesClaimName).Select(c => c.Value);

            return roles.Any(r => r == Role.SUPER_ADMINISTRATOR_ROLE);
        }

        public static BadRequestObjectResult BadRequestMessage(this Controller controller, string message)
        {
            return controller.BadRequest(new List<ValidationFailure>() { new ValidationFailure("", message) });
        }
    }
}