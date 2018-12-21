
using System.Linq;
using System.Security.Claims;
using api.Controllers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using OneAdvisor.Model.Directory.Interface;
using OneAdvisor.Model.Directory.Model.Role;

namespace api.App.Authorization
{
    public class UseCaseAuthorizeFilter : IAuthorizationFilter
    {
        public UseCaseAuthorizeFilter(string[] useCases) => UseCases = useCases;

        public string[] UseCases { get; set; }

        public void OnAuthorization(AuthorizationFilterContext context)
        {
            //No or bad token
            if (!context.HttpContext.User.Identity.IsAuthenticated)
            {
                context.Result = new UnauthorizedResult();
                return;
            }

            var roleService = context.HttpContext.RequestServices.GetService(typeof(IRoleService)) as IRoleService;

            //Token is good, check if role has acces to use case
            var roles = context.HttpContext.User.Claims.Where(c => c.Type == ClaimTypes.Role).Select(c => c.Value);

            //Super admins can do all
            if (roles.Any(r => r == Role.SUPER_ADMINISTRATOR_ROLE))
                return;

            if (!roleService.HasUseCase(roles, UseCases).GetAwaiter().GetResult())
                context.Result = new UnauthorizedResult();
        }
    }

    public class UseCaseAuthorizeAttribute : TypeFilterAttribute
    {
        public UseCaseAuthorizeAttribute(params string[] useCases) : base(typeof(UseCaseAuthorizeFilter))
        {
            Arguments = new object[] { useCases };
        }
    }
}