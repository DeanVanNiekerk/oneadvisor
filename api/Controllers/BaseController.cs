using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
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
            UserId = Context.GetUserId(contextAccessor.HttpContext.User);
            BranchId = Context.GetBranchId(contextAccessor.HttpContext.User);
            RoleIds = Context.GetRoleIds(contextAccessor.HttpContext.User);
            Scope = Context.GetScope(contextAccessor.HttpContext.User);
        }

        public string UserId { get; set; }

        public Guid BranchId { get; set; }

        public Scope Scope { get; set; }

        public IEnumerable<string> RoleIds { get; set; }

        public bool IsSuperAdmin
        {
            get
            {
                return RoleIds.Any(r => r == Role.SUPER_ADMINISTRATOR_ROLE);
            }
        }

    }
}