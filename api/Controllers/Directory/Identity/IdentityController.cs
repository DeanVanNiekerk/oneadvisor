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
        public IdentityController(IUseCaseService useCaseService, IOrganisationService organisationService)
        {
            UseCaseService = useCaseService;
            OrganisationService = organisationService;
        }

        private IMapper Mapper { get; }
        private IUseCaseService UseCaseService { get; }
        private IOrganisationService OrganisationService { get; }

        [HttpGet("")]
        public async Task<IdentityDto> Index()
        {
            var identity = Context.GetIdentity(User);
            var useCaseIds = await UseCaseService.GetUseCases(identity.RoleIds);
            var organisation = await OrganisationService.GetOrganisation(identity.OrganisationId);

            return new IdentityDto()
            {
                Id = identity.Id,
                FirstName = identity.FirstName,
                LastName = identity.LastName,
                OrganisationName = organisation.Name,
                OrganisationId = identity.OrganisationId,
                RoleIds = identity.RoleIds.Where(r => r != "Everyone"),
                UseCaseIds = useCaseIds
            };
        }
    }
}
