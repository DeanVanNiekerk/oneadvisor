
using System.Collections.Generic;
using System.Linq;
using FluentValidation;
using OneAdvisor.Data;
using OneAdvisor.Model.Account.Model.Authentication;
using OneAdvisor.Model.Commission.Model.CommissionSplitRule;
using OneAdvisor.Service.Common;

namespace OneAdvisor.Service.Commission.Validators
{
    public class CommissionSplitRuleValidator : AbstractValidator<CommissionSplitRule>
    {
        private readonly DataContext _context;

        public CommissionSplitRuleValidator(DataContext context, ScopeOptions scope, bool isInsert)
        {
            _context = context;

            if (!isInsert)
                RuleFor(c => c.Id).NotEmpty();

            RuleFor(c => c.Name).NotEmpty();
            RuleFor(c => c.UserId).NotEmpty();
            RuleFor(c => c.UserId).UserMustBeInScope(context, scope);
            RuleFor(c => c.Split).Must(AddUpTo100Percent).WithMessage("Split Percentages must add up to 100");
            RuleForEach(c => c.Split).SetValidator(new CommissionSplitValidator(context, scope));
        }

        private bool AddUpTo100Percent(IEnumerable<CommissionSplit> splits)
        {
            var sum = splits.Sum(s => s.Percentage);
            return sum == 100;
        }
    }

    public class CommissionSplitValidator : AbstractValidator<CommissionSplit>
    {
        public CommissionSplitValidator(DataContext context, ScopeOptions scope)
        {
            RuleFor(c => c.UserId).UserMustBeInScope(context, scope);
            RuleFor(c => c.Percentage).InclusiveBetween(0, 100);
        }
    }
}