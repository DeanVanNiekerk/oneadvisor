﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using api.App.Authorization;
using OneAdvisor.Model.Directory.Interface;
using api.Controllers.Directory.Organisations.Dto;
using OneAdvisor.Model.Common;
using OneAdvisor.Model.Directory.Model.Organisation;
using api.App.Dtos;
using Microsoft.AspNetCore.Http;
using OneAdvisor.Model.Directory.Model.Role;
using OneAdvisor.Model.Account.Interface;

namespace api.Controllers.Directory.Organisations
{

    [ApiController]
    [Route("api/directory/organisations")]
    public class OrganisationsController : Controller
    {
        public OrganisationsController(IMapper mapper, IAuthenticationService authenticationService, IOrganisationService organisationService)
        {
            Mapper = mapper;
            OrganisationService = organisationService;
            AuthenticationService = authenticationService;
        }

        private IMapper Mapper { get; }
        private IOrganisationService OrganisationService { get; }
        private IAuthenticationService AuthenticationService { get; }

        [HttpGet("")]
        [UseCaseAuthorize("dir_view_organisations")]
        public async Task<PagedItemsDto<OrganisationDto>> Index()
        {
            var scope = AuthenticationService.GetScope(User, User.IsSuperAdmin());

            var queryOptions = new OrganisationQueryOptions(scope);
            var pagedItems = await OrganisationService.GetOrganisations(queryOptions);

            return Mapper.MapToPageItemsDto<Organisation, OrganisationDto>(pagedItems);
        }

        [HttpGet("{organisationId}")]
        [UseCaseAuthorize("dir_view_organisations")]
        public async Task<ActionResult<OrganisationDto>> Get(Guid organisationId)
        {
            var scope = AuthenticationService.GetScope(User, User.IsSuperAdmin());

            var model = await OrganisationService.GetOrganisation(scope, organisationId);

            if (model == null)
                return NotFound();

            return Ok(Mapper.Map<OrganisationDto>(model));
        }

        [HttpPost]
        [RoleAuthorize(Role.SUPER_ADMINISTRATOR_ROLE)]
        [UseCaseAuthorize("dir_edit_organisations")]
        public async Task<ActionResult<Result>> Insert([FromBody] OrganisationDto organisation)
        {
            var scope = AuthenticationService.GetScope(User, User.IsSuperAdmin());

            var model = Mapper.Map<Organisation>(organisation);

            var result = await OrganisationService.InsertOrganisation(scope, model);

            if (!result.Success)
                return BadRequest(result.ValidationFailures);

            return Ok(result);
        }

        [HttpPost("{organisationId}")]
        [UseCaseAuthorize("dir_edit_organisations")]
        public async Task<ActionResult<Result>> Update(Guid organisationId, [FromBody] OrganisationDto organisation)
        {
            var scope = AuthenticationService.GetScope(User, User.IsSuperAdmin());

            organisation.Id = organisationId;

            var model = Mapper.Map<Organisation>(organisation);

            var result = await OrganisationService.UpdateOrganisation(scope, model);

            if (!result.Success)
                return BadRequest(result.ValidationFailures);

            return Ok(result);
        }
    }

}
