
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
                RuleFor(o => o.Id).GuidNotEmpty();

            RuleFor(o => o.CommissionTypeId).GuidNotEmpty();
            RuleFor(o => o.PolicyId).GuidNotEmpty();
            RuleFor(o => o.AmountIncludingVAT).NotEmpty().LessThanOrEqualTo(999999999);
            RuleFor(o => o.VAT).NotEmpty().LessThanOrEqualTo(999999999);
        }
    }
}