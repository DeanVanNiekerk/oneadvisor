using System;
using System.Linq;
using System.Threading.Tasks;
using api.App.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using OneAdvisor.Import.Excel.Readers;
using OneAdvisor.Model;
using OneAdvisor.Model.Account.Interface;
using OneAdvisor.Model.Commission.Interface;
using OneAdvisor.Model.Commission.Model.CommissionStatement;
using OneAdvisor.Model.Commission.Model.CommissionStatementTemplate;
using OneAdvisor.Model.Commission.Model.CommissionStatementTemplate.Configuration;
using OneAdvisor.Model.Common;
using OneAdvisor.Model.Directory.Interface;
using OneAdvisor.Service.Commission.Validators;

namespace api.Controllers.Commission.CommissionStatementTemplates
{
    [ApiController]
    [Route("api/commission/statements/templates")]
    public class CommissionStatementTemplateController : Controller
    {
        public CommissionStatementTemplateController(ICommissionStatementTemplateService commissionStatementTemplateService)
        {
            CommissionStatementTemplateService = commissionStatementTemplateService;
        }

        private ICommissionStatementTemplateService CommissionStatementTemplateService { get; }


        [HttpGet("")]
        [UseCaseAuthorize("com_view_commission_statement_templates")]
        public async Task<IActionResult> Index()
        {
            var pagedItems = await CommissionStatementTemplateService.GetTemplates();

            return Ok(pagedItems);
        }

        [HttpGet("{templateId}")]
        [UseCaseAuthorize("com_view_commission_statement_templates")]
        public async Task<IActionResult> Get(Guid templateId)
        {
            var model = await CommissionStatementTemplateService.GetTemplate(templateId);

            if (model == null)
                return NotFound();

            return Ok(model);
        }

        [HttpPost]
        [UseCaseAuthorize("com_edit_commission_statement_templates")]
        public async Task<IActionResult> Insert([FromBody] CommissionStatementTemplateEdit template)
        {
            var result = await CommissionStatementTemplateService.InsertTemplate(template);

            if (!result.Success)
                return BadRequest(result.ValidationFailures);

            return Ok(result);
        }

        [HttpPost("{templateId}")]
        [UseCaseAuthorize("com_edit_commission_statement_templates")]
        public async Task<IActionResult> Update(Guid templateId, [FromBody] CommissionStatementTemplateEdit template)
        {
            template.Id = templateId;

            var result = await CommissionStatementTemplateService.UpdateTemplate(template);

            if (!result.Success)
                return BadRequest(result.ValidationFailures);

            return Ok(result);
        }

        [HttpPost("{templateId}/{sheetPosition}/excel/uniqueCommissionTypes")]
        [UseCaseAuthorize("com_edit_commission_statement_templates")]
        public async Task<IActionResult> UniqueCommissionTypes(Guid templateId, int sheetPosition)
        {
            var file = Request.Form.Files.FirstOrDefault();
            var template = await CommissionStatementTemplateService.GetTemplate(templateId);

            if (file == null || template == null)
                return BadRequest();

            var reader = new UniqueCommissionTypesReader(template.Config.Sheets.Single(s => s.Position == sheetPosition));
            var items = reader.Read(file.OpenReadStream());

            return Ok(items);
        }
    }

}
