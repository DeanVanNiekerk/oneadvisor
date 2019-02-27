
using System.Collections.Generic;
using System.Linq;
using FluentValidation;
using OneAdvisor.Model.Commission.Model.CommissionStatementTemplate;
using OneAdvisor.Model.Commission.Model.CommissionStatementTemplate.Configuration;
using OneAdvisor.Service.Common;
using OneAdvisor.Service.Common.Validation;

namespace OneAdvisor.Service.Commission.Validators
{
    public class CommissionStatementTemplateValidator : AbstractValidator<CommissionStatementTemplateEdit>
    {
        public CommissionStatementTemplateValidator(bool isInsert)
        {
            if (!isInsert)
                RuleFor(t => t.Id).NotEmpty();

            RuleFor(t => t.Name).NotEmpty();
            RuleFor(t => t.CompanyId).NotEmpty().WithName("Company");
            RuleFor(t => t.Config).NotNull();
            RuleFor(t => t.Config).SetValidator(new ConfigValidator());
        }
    }

    internal class ConfigValidator : AbstractValidator<Config>
    {
        public ConfigValidator()
        {
            RuleFor(t => t.DataStart).NotNull();
            RuleFor(t => t.DataStart).SetValidator(new DataStartValidator());
        }
    }

    internal class DataStartValidator : AbstractValidator<DataStart>
    {
        public DataStartValidator()
        {
            RuleFor(t => t.HeaderColumn).MustBeValidExcelColumn().WithName("Header Column");
            RuleFor(t => t.HeaderValue).NotEmpty().WithName("Header Value");
        }
    }
}