
using System.Collections.Generic;
using System.Linq;
using FluentValidation;
using OneAdvisor.Model.Member.Model.Member;

namespace OneAdvisor.Service.Member.Validators
{
    public class MemberValidator : AbstractValidator<MemberEdit>
    {
        public MemberValidator(bool isInsert)
        {
            if (!isInsert)
                RuleFor(o => o.Id).NotEmpty();

            RuleFor(o => o.FirstName).NotNull().MaximumLength(32);
            RuleFor(o => o.LastName).NotNull().MaximumLength(32);
            RuleFor(o => o.IdNumber).NotEmpty().MaximumLength(64);
        }
    }
}