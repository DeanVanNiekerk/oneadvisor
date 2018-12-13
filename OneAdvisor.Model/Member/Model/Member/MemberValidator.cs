
using System.Collections.Generic;
using System.Linq;
using FluentValidation;

namespace OneAdvisor.Model.Member.Model.Member
{
    public class MemberValidator : AbstractValidator<MemberEdit>
    {
        public MemberValidator(bool isInsert)
        {
            if (!isInsert)
                RuleFor(o => o.Id).NotEmpty();

            RuleFor(o => o.FirstName).NotEmpty();
            RuleFor(o => o.LastName).NotEmpty();
        }
    }
}