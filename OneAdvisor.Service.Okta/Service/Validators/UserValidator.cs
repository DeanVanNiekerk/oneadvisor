using System.Collections.Generic;
using System.Linq;
using FluentValidation;
using OneAdvisor.Model.Directory.Model.User;

namespace OneAdvisor.Service.Okta.Service.Validators
{
    public class UserValidator : AbstractValidator<UserEdit>
    {
        public UserValidator(bool isInsert)
        {
            if (!isInsert)
                RuleFor(u => u.Id).NotEmpty();

            RuleFor(u => u.FirstName).NotEmpty();
            RuleFor(u => u.LastName).NotEmpty();
            RuleFor(u => u.BranchId).NotEmpty();
            RuleFor(u => u.Login).NotEmpty();
            RuleFor(u => u.Email).NotEmpty().EmailAddress();
            RuleForEach(x => x.Aliases).NotEmpty().MaximumLength(64);
        }
    }
}