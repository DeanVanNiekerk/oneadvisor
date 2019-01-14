using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using api.App.Authorization;
using api.Controllers.Directory.Lookups.Dto;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using OneAdvisor.Model.Common;
using OneAdvisor.Model.Directory.Interface;
using OneAdvisor.Model.Directory.Model.Lookup;

namespace api.Controllers.Directory.Lookups
{
    [ApiController]
    [Route("api/directory/lookups")]
    public class LookupsController : Controller
    {
        public LookupsController(IMapper mapper, ILookupService lookupService)
        {
            Mapper = mapper;
            LookupService = lookupService;
        }

        private IMapper Mapper { get; }
        private ILookupService LookupService { get; }

        [HttpGet("companies")]
        public async Task<List<CompanyDto>> Index()
        {
            var models = await LookupService.GetCompanies();

            return Mapper.MapList<Company, CompanyDto>(models);
        }

        [HttpPost("companies")]
        [UseCaseAuthorize("dir_edit_lookups")]
        public async Task<ActionResult<Result>> Insert([FromBody] CompanyDto dto)
        {
            var model = Mapper.Map<Company>(dto);

            var result = await LookupService.InsertCompany(model);

            if (!result.Success)
                return BadRequest(result.ValidationFailures);

            return Ok(result);
        }

        [HttpPost("companies/{companyId}")]
        [UseCaseAuthorize("dir_edit_lookups")]
        public async Task<ActionResult<Result>> Update(Guid companyId, [FromBody] CompanyDto dto)
        {
            dto.Id = companyId;

            var model = Mapper.Map<Company>(dto);

            var result = await LookupService.UpdateCompany(model);

            if (!result.Success)
                return BadRequest(result.ValidationFailures);

            return Ok(result);
        }
    }

}