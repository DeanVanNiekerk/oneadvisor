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
using api.Controllers.Directory.Identity.Dto;

namespace api.Controllers.Directory.Identity
{
    [Authorize]
    [ApiController]
    [Route("api/directory/identity")]
    public class IdentityController : Controller
    {
        public IdentityController(IUseCaseService useCaseService)
        {
            UseCaseService = useCaseService;
        }

        private IMapper Mapper { get; }
        private IUseCaseService UseCaseService { get; }

        [HttpGet("")]
        public async Task<IdentityDto> Index()
        {
            var identity = Context.GetIdentity(User);
            var useCaseIds = await UseCaseService.GetUseCases(identity.RoleIds);

            return new IdentityDto()
            {
                Id = identity.Id,
                FirstName = identity.FirstName,
                LastName = identity.LastName,
                OrganisationId = identity.OrganisationId,
                RoleIds = identity.RoleIds,
                UseCaseIds = useCaseIds
            };
        }
    }
}
