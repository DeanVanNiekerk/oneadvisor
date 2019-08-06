using System;
using FluentValidation;
using FluentValidation.Results;
using FluentValidation.Validators;
using OneAdvisor.Data;
using OneAdvisor.Model.Account.Model.Authentication;
using OneAdvisor.Model.Directory.Model.User;

namespace OneAdvisor.Service.Directory.Validators
{
    public class UserValidator : AbstractValidator<UserEdit>
    {
        private readonly ScopeOptions _scope;

        public UserValidator(DataContext dataContext, ScopeOptions scope, bool isInsert)
        {
            _scope = scope;

            if (!isInsert)
                RuleFor(u => u.Id).NotEmpty();

            RuleFor(u => u.LastName).NotEmpty().WithName("Last Name");
            RuleFor(u => u.BranchId).BranchMustBeInScope(dataContext, scope);
            RuleFor(u => u.Email).NotEmpty().EmailAddress();
            RuleFor(u => u.Scope).IsInEnum();
            RuleFor(u => u.Scope).Must(s => Convert.ToInt32(s) >= Convert.ToInt32(scope.Scope)).WithMessage("Scope must be equal or to less than yours");
            RuleFor(u => u).Custom(MustNotBeUserScope);

            RuleFor(u => u.Email)
                .NotEmpty()
                .EmailAddress();

            RuleFor(x => x.Roles)
                .NotEmpty()
                .WithMessage("Please add at least 1 role");

            RuleForEach(x => x.Roles)
                .NotEmpty()
                .WithName("Roles");

            RuleForEach(x => x.Aliases)
               .NotEmpty()
               .WithName("Aliases");
        }

        private void MustNotBeUserScope(UserEdit user, CustomContext context)
        {
            if (_scope.Scope == Scope.User)
            {
                var failure = new ValidationFailure("", "Only Organisation or Branch Scope Allowed");
                context.AddFailure(failure);
            }
        }
    }
}