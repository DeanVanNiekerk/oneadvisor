using System;
using api.App.Authorization;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
    public abstract class BaseController : Controller
    {
        public BaseController(IHttpContextAccessor contextAccessor)
        {
            OrganisationId = Context.GetOrganisationId(contextAccessor.HttpContext.User);
        }

        public Guid OrganisationId { get; set; }

    }
}