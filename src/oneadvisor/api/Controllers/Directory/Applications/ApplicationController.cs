using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using OneAdvisor.Model.Directory.Interface;

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
        public async Task<IActionResult> Index()
        {
            var applications = await ApplicationService.GetApplications();

            return Ok(applications);
        }

    }

}
