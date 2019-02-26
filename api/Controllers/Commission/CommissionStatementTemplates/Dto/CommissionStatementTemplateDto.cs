using System;

namespace api.Controllers.Commission.CommissionStatementTemplates.Dto
{
    public class CommissionStatementTemplateDto
    {
        public Guid Id { get; set; }
        public Guid CompanyId { get; set; }
        public string Name { get; set; }
    }
}