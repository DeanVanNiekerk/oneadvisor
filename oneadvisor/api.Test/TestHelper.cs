using System;
using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;
using OneAdvisor.Model.Account.Interface;
using OneAdvisor.Model.Account.Model.Authentication;
using OneAdvisor.Model.Directory.Model.User;
using OneAdvisor.Service.Account;

namespace api.Test
{
    public class TestHelper
    {
        public static Mock<IAuthenticationService> MockAuthenticationService(Scope scope = Scope.Branch)
        {
            var service = new Mock<IAuthenticationService>();

            var options = new ScopeOptions(Guid.NewGuid(), Guid.NewGuid(), Guid.NewGuid(), scope);

            service.Setup(x => x.GetScope(It.IsAny<ClaimsPrincipal>(), It.IsAny<bool>())).Returns(options);

            return service;
        }

        public static ControllerContext GetControllerContext(ClaimsPrincipal user)
        {
            return new ControllerContext()
            {
                HttpContext = new DefaultHttpContext() { User = user }
            };
        }
    }
}