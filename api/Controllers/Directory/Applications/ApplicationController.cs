using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using api.App.Authorization;
using OneAdvisor.Model.Directory.Interface;
using OneAdvisor.Model.Common;
using api.App.Dtos;
using OneAdvisor.Model.Directory.Model.Application;

namespace api.Controllers.Directory.Applications
{

    [ApiController]
    [Route("api/directory/applications")]
    public class ApplicationsController : Controller
    {
        public ApplicationsController(IApplicationService applicationService)
        {
            ApplicationService = applicationService;
        }

        private IApplicationService ApplicationService { get; }

        [HttpGet("")]
        [UseCaseAuthorize("dir_view_applications")]
        public async Task<IActionResult> Index()
        {
            var applications = await ApplicationService.GetApplications();

            return Ok(applications);
        }

    }

}
