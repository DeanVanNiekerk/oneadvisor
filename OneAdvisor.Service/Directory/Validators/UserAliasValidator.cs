
using System.Collections.Generic;
using System.Linq;
using FluentValidation;
using OneAdvisor.Model.Directory.Model.UserAlias;

namespace OneAdvisor.Service.Directory.Validators
{
    public class UserAliasValidator : AbstractValidator<UserAlias>
    {
        public UserAliasValidator(bool isInsert)
        {
            if (!isInsert)
                RuleFor(o => o.Id).NotEmpty();

            if (isInsert)
                RuleFor(o => o.UserId).NotEmpty();

            RuleFor(o => o.Name).NotEmpty().MaximumLength(64); ;
        }
    }
}