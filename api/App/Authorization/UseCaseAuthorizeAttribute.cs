
using System.Linq;
using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using OneAdvisor.Model.Directory.Interface.Service;

namespace api.App.Authorization
{
    public class UseCaseAuthorizeFilter : IAuthorizationFilter
    {
        public UseCaseAuthorizeFilter(string useCase) => UseCase = useCase;

        public string UseCase { get; set; }

        public void OnAuthorization(AuthorizationFilterContext context)
        {
            //No or bad token
            if(!context.HttpContext.User.Identity.IsAuthenticated) {
                context.Result = new UnauthorizedResult();
                return;
            }

            var roleService = context.HttpContext.RequestServices.GetService(typeof(IRoleService)) as IRoleService;

            //Token is good, check if role has acces to use case
            var roles = context.HttpContext.User.Claims.Where(c => c.Type == ClaimTypes.Role).Select(c => c.Value);
            
            if(!roleService.HasUseCase(roles, UseCase).GetAwaiter().GetResult())
                context.Result = new UnauthorizedResult();

        }
    }

    public class UseCaseAuthorizeAttribute : TypeFilterAttribute
    {
        public UseCaseAuthorizeAttribute(string useCase) : base(typeof(UseCaseAuthorizeFilter))
        {
            Arguments = new object[] { useCase };
        }
    }
}