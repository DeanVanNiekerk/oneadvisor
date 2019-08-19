using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using OneAdvisor.Model.Directory.Interface;
using Microsoft.AspNetCore.Authorization;

namespace api.Controllers.Directory.UseCases
{
    [Authorize]
    [ApiController]
    [Route("api/directory/usecases")]
    public class UseCasesController : Controller
    {
        public UseCasesController(IUseCaseService useCaseService)
        {
            UseCaseService = useCaseService;
        }

        private IUseCaseService UseCaseService { get; }

        [HttpGet("")]
        public async Task<IActionResult> Index()
        {
            var useCases = await UseCaseService.GetUseCases();

            return Ok(useCases);
        }
    }
}
