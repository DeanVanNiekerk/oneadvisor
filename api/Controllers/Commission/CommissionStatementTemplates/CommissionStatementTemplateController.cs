using System;
using System.Threading.Tasks;
using api.App.Authorization;
using api.App.Dtos;
using api.Controllers.Commission.CommissionStatements.Dto;
using api.Controllers.Commission.CommissionStatementTemplates.Dto;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using OneAdvisor.Model.Account.Interface;
using OneAdvisor.Model.Commission.Interface;
using OneAdvisor.Model.Commission.Model.CommissionStatement;
using OneAdvisor.Model.Commission.Model.CommissionStatementTemplate;
using OneAdvisor.Model.Common;
using OneAdvisor.Model.Directory.Interface;

namespace api.Controllers.Commission.CommissionStatementTemplates
{
    [ApiController]
    [Route("api/commission/statements/templates")]
    public class CommissionStatementTemplateController : Controller
    {
        public CommissionStatementTemplateController(IMapper mapper, ICommissionStatementTemplateService commissionStatementTemplateService)
        {
            Mapper = mapper;
            CommissionStatementTemplateService = commissionStatementTemplateService;
        }

        private IMapper Mapper { get; }
        private ICommissionStatementTemplateService CommissionStatementTemplateService { get; }


        [HttpGet("")]
        [UseCaseAuthorize("com_view_commission_statement_templates")]
        public async Task<PagedItemsDto<CommissionStatementTemplateDto>> Index()
        {
            var pagedItems = await CommissionStatementTemplateService.GetTemplates();

            return Mapper.MapToPageItemsDto<CommissionStatementTemplate, CommissionStatementTemplateDto>(pagedItems);
        }

        [HttpGet("{templateId}")]
        [UseCaseAuthorize("com_view_commission_statement_templates")]
        public async Task<ActionResult<CommissionStatementTemplateEditDto>> Get(Guid templateId)
        {
            var model = await CommissionStatementTemplateService.GetTemplate(templateId);

            if (model == null)
                return NotFound();

            return Ok(Mapper.Map<CommissionStatementTemplateEditDto>(model));
        }

        [HttpPost]
        [UseCaseAuthorize("com_edit_commission_statement_templates")]
        public async Task<ActionResult<Result>> Insert([FromBody] CommissionStatementTemplateEditDto template)
        {
            var model = Mapper.Map<CommissionStatementTemplateEdit>(template);

            var result = await CommissionStatementTemplateService.InsertTemplate(model);

            if (!result.Success)
                return BadRequest(result.ValidationFailures);

            return Ok(result);
        }

        [HttpPost("{templateId}")]
        [UseCaseAuthorize("com_edit_commission_statement_templates")]
        public async Task<ActionResult<Result>> Update(Guid templateId, [FromBody] CommissionStatementTemplateEditDto template)
        {
            template.Id = templateId;

            var model = Mapper.Map<CommissionStatementTemplateEdit>(template);

            var result = await CommissionStatementTemplateService.UpdateTemplate(model);

            if (!result.Success)
                return BadRequest(result.ValidationFailures);

            return Ok(result);
        }
    }

}