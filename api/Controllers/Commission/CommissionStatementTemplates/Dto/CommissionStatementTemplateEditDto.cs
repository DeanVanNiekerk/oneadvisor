using System;
using OneAdvisor.Model.Commission.Model.CommissionStatementTemplate.Configuration;

namespace api.Controllers.Commission.CommissionStatementTemplates.Dto
{
    public class CommissionStatementTemplateEditDto
    {
        public Guid? Id { get; set; }
        public Guid? CompanyId { get; set; }
        public string Name { get; set; }
        public Config Config { get; set; }
    }
}