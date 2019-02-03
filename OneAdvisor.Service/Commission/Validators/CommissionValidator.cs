
using System.Collections.Generic;
using System.Linq;
using FluentValidation;
using OneAdvisor.Model.Commission.Model.Commission;
using OneAdvisor.Service.Common;

namespace OneAdvisor.Service.Commission.Validators
{
    public class CommissionValidator : AbstractValidator<CommissionEdit>
    {
        public CommissionValidator(bool isInsert)
        {
            if (!isInsert)
                RuleFor(o => o.Id).NotEmpty();

            RuleFor(o => o.CommissionStatementId).NotEmpty().WithName("Commission Statement");
            RuleFor(o => o.CommissionTypeId).NotEmpty().WithName("Type");
            RuleFor(o => o.PolicyId).NotEmpty().WithName("Policy");
            RuleFor(o => o.AmountIncludingVAT).InclusiveBetween(0, 999999999).WithName("Amount");
            RuleFor(o => o.VAT).InclusiveBetween(0, 999999999).WithName("VAT");
        }
    }
}