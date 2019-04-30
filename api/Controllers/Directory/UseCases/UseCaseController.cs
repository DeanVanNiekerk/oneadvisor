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
using OneAdvisor.Model.Directory.Model.UseCase;

namespace api.Controllers.Directory.UseCases
{
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
        [UseCaseAuthorize("dir_view_usecases")]
        public async Task<IActionResult> Index()
        {
            var useCases = await UseCaseService.GetUseCases();

            return Ok(useCases);
        }
    }
}
