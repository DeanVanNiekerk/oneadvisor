
using System.Collections.Generic;
using System.Linq;
using FluentValidation;
using OneAdvisor.Model.Commission.Model.CommissionStatementTemplate;
using OneAdvisor.Service.Common;

namespace OneAdvisor.Service.Commission.Validators
{
    public class CommissionStatementTemplateValidator : AbstractValidator<CommissionStatementTemplateEdit>
    {
        public CommissionStatementTemplateValidator(bool isInsert)
        {
            if (!isInsert)
                RuleFor(o => o.Id).NotEmpty();

            RuleFor(o => o.Name).NotEmpty();
            RuleFor(o => o.CompanyId).NotEmpty().WithName("Company");
            //RuleFor(o => o.Config).NotEmpty().WithName("VAT");
        }
    }
}