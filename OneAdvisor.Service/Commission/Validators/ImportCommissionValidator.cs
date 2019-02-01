
using System.Collections.Generic;
using System.Linq;
using FluentValidation;
using OneAdvisor.Model.Commission.Model.ImportCommission;
using OneAdvisor.Service.Common;

namespace OneAdvisor.Service.Commission.Validators
{
    public class ImportCommissionValidator : AbstractValidator<ImportCommission>
    {
        public ImportCommissionValidator()
        {
            RuleFor(o => o.PolicyNumber).NotEmpty().WithName("Policy Number");
            RuleFor(o => o.CommissionTypeCode).NotEmpty().WithName("Commission Type Code");
            RuleFor(o => o.Date).NotEmpty();
            RuleFor(o => o.AmountIncludingVAT).InclusiveBetween(0, 999999999).WithName("Amount");
            RuleFor(o => o.VAT).InclusiveBetween(0, 999999999).WithName("VAT");
        }
    }
}