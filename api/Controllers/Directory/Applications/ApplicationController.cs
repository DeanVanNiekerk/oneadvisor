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
using api.Controllers.Directory.Applications.Dto;
using OneAdvisor.Model.Directory.Model.Application;

namespace api.Controllers.Directory.Roles
{
    
    [ApiController]
    [Route("api/directory/applications")]
    public class ApplicationsController : Controller
    {
        public ApplicationsController(IMapper mapper, IApplicationService applicationService)
        {
            Mapper = mapper;
            ApplicationService = applicationService;
        }

        private IMapper Mapper { get; }
        private IApplicationService ApplicationService { get; }

        [HttpGet("")]
        [UseCaseAuthorize("dir_view_applications")]
        public async Task<List<ApplicationDto>> Index()
        {
            var applications = await ApplicationService.GetApplications();

            return Mapper.MapList<Application, ApplicationDto>(applications);
        }

    }

}
