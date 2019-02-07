
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
            RuleFor(o => o.AmountIncludingVAT).NotEmpty().WithName("Amount").Must(BeDecimal).WithMessage("'{PropertyName}' must be a number");
            RuleFor(o => o.VAT).NotEmpty().WithName("VAT").Must(BeDecimal).WithMessage("'{PropertyName}' must be a number");
        }

        public bool BeDecimal(string value)
        {
            decimal output;
            return decimal.TryParse(value, out output);
        }
    }
}