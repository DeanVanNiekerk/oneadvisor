
using System.Collections.Generic;
using System.Linq;
using FluentValidation;
using OneAdvisor.Data;
using OneAdvisor.Model.Account.Model.Authentication;
using OneAdvisor.Model.Commission.Model.Commission;
using OneAdvisor.Service.Common;

namespace OneAdvisor.Service.Commission.Validators
{
    public class CommissionValidator : AbstractValidator<CommissionEdit>
    {
        public CommissionValidator(DataContext context, ScopeOptions scope, bool isInsert)
        {
            if (!isInsert)
                RuleFor(o => o.Id).NotEmpty();

            RuleFor(c => c.CommissionStatementId).NotEmpty().WithName("Commission Statement");
            RuleFor(c => c.CommissionTypeId).NotEmpty().WithName("Type");

            RuleFor(c => c.PolicyId).PolicyMustBeInScope(context, scope);
            RuleFor(c => c.UserId).UserMustBeInScope(context, scope);

            RuleFor(c => c.AmountIncludingVAT).NotEmpty().WithName("Amount");
            RuleFor(c => c.VAT).NotEmpty().WithName("VAT");

        }
    }
}