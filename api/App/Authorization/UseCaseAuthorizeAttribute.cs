
using System.Linq;
using System.Security.Claims;
using api.Controllers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using OneAdvisor.Model.Account.Model.Authentication;
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
            //Check token is valid and not expired
            if (!context.HttpContext.User.Identity.IsAuthenticated)
            {
                context.Result = new UnauthorizedResult();
                return;
            }

            //Token is good, check if use case exists
            var useCases = context.HttpContext.User.Claims.Where(c => c.Type == Claims.UseCaseIdsClaimName).Select(c => c.Value);

            if (useCases.Any(u => UseCases.Contains(u)))
                return;

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