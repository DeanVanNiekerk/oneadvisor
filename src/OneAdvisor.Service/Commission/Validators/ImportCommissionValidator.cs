
using System;
using System.Collections.Generic;
using System.Linq;
using FluentValidation;
using OneAdvisor.Model.Commission.Model.ImportCommission;
using OneAdvisor.Service.Common;
using OneAdvisor.Service.Common.Validation;

namespace OneAdvisor.Service.Commission.Validators
{
    public class ImportCommissionValidator : AbstractValidator<ImportCommission>
    {
        public ImportCommissionValidator()
        {
            RuleFor(o => o.PolicyNumber).NotEmpty().WithName("Policy Number");
            RuleFor(o => o.CommissionTypeCode).NotEmpty().WithName("Commission Type Code");
            RuleFor(o => o.AmountIncludingVAT).NotEmpty().WithName("Amount").Must(MustRules.BeDecimal).WithMessage("'{PropertyName}' must be a number");
            RuleFor(o => o.VAT).NotEmpty().WithName("VAT").Must(MustRules.BeDecimal).WithMessage("'{PropertyName}' must be a number");
            RuleFor(o => o.DateOfBirth).Must(MustRules.BeNullableDate).WithName("Date of Birth").WithMessage("'{PropertyName}' must be a date (YYYY-MM-DD)");
        }
    }
}