
using System.Collections.Generic;
using System.Linq;
using FluentValidation;
using OneAdvisor.Model.Commission.Model.CommissionStatement;
using OneAdvisor.Service.Common;

namespace OneAdvisor.Service.Commission.Validators
{
    public class CommissionStatementValidator : AbstractValidator<CommissionStatementEdit>
    {
        public CommissionStatementValidator(bool isInsert)
        {
            if (!isInsert)
                RuleFor(o => o.Id).NotEmpty();

            RuleFor(o => o.CompanyId).NotEmpty().WithName("Company");
            RuleFor(o => o.AmountIncludingVAT).NotEmpty().InclusiveBetween(0, 999999999).WithName("Amount");
            RuleFor(o => o.VAT).NotEmpty().InclusiveBetween(0, 999999999).WithName("VAT");
            RuleFor(o => o.Date).NotEmpty().WithName("Date");
            RuleFor(o => o.Processed).NotEmpty().WithName("Processed");
        }
    }
}