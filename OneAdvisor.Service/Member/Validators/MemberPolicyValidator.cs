using FluentValidation;
using OneAdvisor.Model.Member.Model.MemberPolicy;

namespace OneAdvisor.Service.Member.Validators
{
    public class MemberPolicyValidator : AbstractValidator<MemberPolicyEdit>
    {
        public MemberPolicyValidator(bool isInsert)
        {
            if (!isInsert)
                RuleFor(p => p.Id).NotEmpty();

            RuleFor(p => p.UserId).NotEmpty().MaximumLength(64);
            RuleFor(p => p.Number).NotEmpty().MaximumLength(32);
            RuleFor(p => p.CompanyId).NotEmpty();
        }
    }
}