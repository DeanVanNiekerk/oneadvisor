using System;
using OneAdvisor.Model.Commission.Model.CommissionStatementTemplate.Configuration;

namespace OneAdvisor.Model.Commission.Model.CommissionStatementTemplate
{
    public class CommissionStatementTemplateEdit
    {
        public Guid Id { get; set; }
        public Guid CompanyId { get; set; }
        public string Name { get; set; }
        public Config Config { get; set; }
    }
}