
using System.Linq;
using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace api.App.Authorization
{
    public class RoleAuthorizeAttributeFilter : IAuthorizationFilter
    {
        public RoleAuthorizeAttributeFilter(string[] roles) => Roles = roles;

        public string[] Roles { get; set; }

        public void OnAuthorization(AuthorizationFilterContext context)
        {
            //Check token is valid and not expired
            if (!context.HttpContext.User.Identity.IsAuthenticated)
            {
                context.Result = new UnauthorizedResult();
                return;
            }

            //Token is good, check if role exists
            var roles = context.HttpContext.User.Claims.Where(c => c.Type == ClaimTypes.Role).Select(c => c.Value);

            if (roles.Any(r => Roles.Contains(r)))
                return;

            context.Result = new UnauthorizedResult();
        }
    }

    public class RoleAuthorizeAttribute : TypeFilterAttribute
    {
        public RoleAuthorizeAttribute(params string[] roles) : base(typeof(RoleAuthorizeAttributeFilter))
        {
            Arguments = new object[] { roles };
        }
    }
}