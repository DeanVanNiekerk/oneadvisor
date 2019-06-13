
using System.Collections.Generic;
using System.Linq;
using FluentValidation;
using OneAdvisor.Data;
using OneAdvisor.Model.Account.Model.Authentication;
using OneAdvisor.Model.Commission.Model.CommissionSplitRulePolicy;
using OneAdvisor.Service.Common;

namespace OneAdvisor.Service.Commission.Validators
{
    public class CommissionSplitRulePolicyValidator : AbstractValidator<CommissionSplitRulePolicy>
    {
        public CommissionSplitRulePolicyValidator(DataContext context, ScopeOptions scope, bool isInsert)
        {
            if (!isInsert)
                RuleFor(c => c.Id).NotEmpty();

            RuleFor(c => c.PolicyId).PolicyMustBeInScope(context, scope);
            RuleFor(c => c.CommissionSplitRuleId).CommissionSplitRuleMustBeInScope(context, scope);
        }
    }
}