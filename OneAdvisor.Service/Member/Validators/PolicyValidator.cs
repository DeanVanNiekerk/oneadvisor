using FluentValidation;
using OneAdvisor.Model.Member.Model.Policy;

namespace OneAdvisor.Service.Member.Validators
{
    public class PolicyValidator : AbstractValidator<PolicyEdit>
    {
        public PolicyValidator(bool isInsert)
        {
            if (!isInsert)
                RuleFor(p => p.Id).NotEmpty();

            RuleFor(p => p.UserId).NotEmpty().MaximumLength(64);
            RuleFor(p => p.Number).NotEmpty().MaximumLength(32);
            RuleFor(p => p.CompanyId).NotEmpty();
        }
    }
}