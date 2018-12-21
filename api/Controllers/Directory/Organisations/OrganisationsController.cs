using System;
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

namespace api.Controllers.Directory.Organisations
{

    [ApiController]
    [Route("api/directory/organisations")]
    public class OrganisationsController : Controller
    {
        public OrganisationsController(IMapper mapper, IOrganisationService organisationService)
        {
            Mapper = mapper;
            OrganisationService = organisationService;
        }

        private IMapper Mapper { get; }
        private IOrganisationService OrganisationService { get; }

        [HttpGet("")]
        [UseCaseAuthorize("dir_view_organisations")]
        public async Task<PagedItemsDto<OrganisationDto>> Index()
        {
            var queryOptions = new OrganisationQueryOptions();
            var pagedItems = await OrganisationService.GetOrganisations(queryOptions);

            return Mapper.MapToPageItemsDto<Organisation, OrganisationDto>(pagedItems);
        }

        [HttpGet("{organisationId}")]
        [UseCaseAuthorize("dir_view_organisations")]
        public async Task<ActionResult<OrganisationDto>> Get(Guid organisationId)
        {
            var model = await OrganisationService.GetOrganisation(organisationId);

            if (model == null)
                return NotFound();

            return Ok(Mapper.Map<OrganisationDto>(model));
        }

        [HttpPost]
        [UseCaseAuthorize("dir_edit_organisations")]
        public async Task<ActionResult<Result>> Insert([FromBody] OrganisationDto organisation)
        {
            var model = Mapper.Map<Organisation>(organisation);

            var result = await OrganisationService.InsertOrganisation(model);

            if (!result.Success)
                return BadRequest(result.ValidationFailures);

            return Ok(result);
        }

        [HttpPost("{organisationId}")]
        [UseCaseAuthorize("dir_edit_organisations")]
        public async Task<ActionResult<Result>> Update(Guid organisationId, [FromBody] OrganisationDto organisation)
        {
            organisation.Id = organisationId;

            var model = Mapper.Map<Organisation>(organisation);

            var result = await OrganisationService.UpdateOrganisation(model);

            if (!result.Success)
                return BadRequest(result.ValidationFailures);

            return Ok(result);
        }
    }

}
