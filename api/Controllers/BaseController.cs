using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using api.App.Authorization;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using OneAdvisor.Model.Directory.Model.Role;
using OneAdvisor.Model.Directory.Model.User;

namespace api.Controllers
{
    public abstract class BaseController : Controller
    {
        public BaseController(IHttpContextAccessor contextAccessor)
        {
            UserId = Guid.Parse(contextAccessor.HttpContext.User.Identity.Name);
            Roles = contextAccessor.HttpContext.User.Claims.Where(c => c.Type == ClaimTypes.Role).Select(c => c.Value);
        }

        public Guid UserId { get; set; }

        public IEnumerable<string> Roles { get; set; }

        public bool IsSuperAdmin
        {
            get
            {
                return Roles.Any(r => r == Role.SUPER_ADMINISTRATOR_ROLE);
            }
        }

    }
}