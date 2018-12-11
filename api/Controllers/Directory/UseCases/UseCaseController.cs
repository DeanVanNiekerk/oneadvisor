using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using api.App.Authorization;
using OneAdvisor.Model.Directory.Interface;
using OneAdvisor.Model.Common;
using api.App.Dtos;
using api.Controllers.Directory.UseCases.Dto;
using OneAdvisor.Model.Directory.Model.UseCase;

namespace api.Controllers.Directory.UseCases
{

    [ApiController]
    [Route("api/directory/usecases")]
    public class UseCasesController : Controller
    {
        public UseCasesController(IMapper mapper, IUseCaseService useCaseService)
        {
            Mapper = mapper;
            UseCaseService = useCaseService;
        }

        private IMapper Mapper { get; }
        private IUseCaseService UseCaseService { get; }

        [HttpGet("")]
        [UseCaseAuthorize("dir_view_usecases")]
        public async Task<List<UseCaseDto>> Index()
        {
            var roles = await UseCaseService.GetUseCases();

            return Mapper.MapList<UseCase, UseCaseDto>(roles);
        }
    }
}
