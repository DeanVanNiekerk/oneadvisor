using System;
using FluentValidation;
using OneAdvisor.Model.Account.Model.Authentication;
using OneAdvisor.Model.Directory.Model.User;

namespace OneAdvisor.Service.Directory.Validators
{
    public class UserValidator : AbstractValidator<UserEdit>
    {
        public UserValidator(ScopeOptions scope, bool isInsert)
        {
            if (!isInsert)
                RuleFor(u => u.Id).NotEmpty();

            RuleFor(u => u.LastName).NotEmpty().WithName("Last Name");
            RuleFor(u => u.BranchId).NotEmpty().WithName("Branch");
            RuleFor(u => u.Email).NotEmpty().EmailAddress();
            RuleFor(u => u.Scope).IsInEnum();

            RuleFor(u => u.Scope).Must(s => Convert.ToInt32(s) >= Convert.ToInt32(scope.Scope)).WithMessage("Scope must be equal or to less than yours");

            RuleFor(u => u.Email)
                .NotEmpty()
                .EmailAddress();

            RuleForEach(x => x.Roles)
                .NotEmpty()
                .WithName("Roles");
        }
    }
}