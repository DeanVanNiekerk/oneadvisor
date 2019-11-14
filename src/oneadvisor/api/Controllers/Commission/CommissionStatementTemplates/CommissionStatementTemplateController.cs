using System;
using System.Linq;
using System.Threading.Tasks;
using api.App.Authorization;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OneAdvisor.Import.Excel.Readers;
using OneAdvisor.Model.Commission.Interface;
using OneAdvisor.Model.Commission.Model.CommissionStatementTemplate;
using OneAdvisor.Model.Directory.Model.Role;

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
        [Authorize]
        public async Task<IActionResult> Index(string sortColumn, string sortDirection, int pageSize = 0, int pageNumber = 0, string filters = null)
        {
            var queryOptions = new CommissionStatementTemplateQueryOptions(sortColumn, sortDirection, pageSize, pageNumber, filters);

            var pagedItems = await CommissionStatementTemplateService.GetTemplates(queryOptions);

            return Ok(pagedItems);
        }

        [HttpGet("{templateId}")]
        [Authorize]
        public async Task<IActionResult> Get(Guid templateId)
        {
            var model = await CommissionStatementTemplateService.GetTemplate(templateId);

            if (model == null)
                return NotFound();

            return Ok(model);
        }

        [HttpPost]
        [RoleAuthorize(Role.SUPER_ADMINISTRATOR_ROLE)]
        public async Task<IActionResult> Insert([FromBody] CommissionStatementTemplateEdit template)
        {
            var result = await CommissionStatementTemplateService.InsertTemplate(template);

            if (!result.Success)
                return BadRequest(result.ValidationFailures);

            return Ok(result);
        }

        [HttpPost("{templateId}")]
        [RoleAuthorize(Role.SUPER_ADMINISTRATOR_ROLE)]
        public async Task<IActionResult> Update(Guid templateId, [FromQuery] bool updateUnknownCommissionTypes, [FromBody] CommissionStatementTemplateEdit template)
        {
            template.Id = templateId;

            var result = await CommissionStatementTemplateService.UpdateTemplate(template);

            if (!result.Success)
                return BadRequest(result.ValidationFailures);

            if (updateUnknownCommissionTypes)
                await CommissionStatementTemplateService.UpdateUnknownCommissionTypes(template.Id.Value);

            return Ok(result);
        }

        [HttpPost("{templateId}/{sheetPosition}/excel/uniqueCommissionTypes")]
        [RoleAuthorize(Role.SUPER_ADMINISTRATOR_ROLE)]
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
