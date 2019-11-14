using System;
using System.Collections.Generic;
using System.Linq;
using FluentValidation;
using FluentValidation.Results;
using FluentValidation.Validators;
using OneAdvisor.Data;
using OneAdvisor.Model.Account.Model.Authentication;
using OneAdvisor.Model.Directory.Model.Application;
using OneAdvisor.Model.Directory.Model.User;

namespace OneAdvisor.Service.Directory.Validators
{
    public class UserValidator : AbstractValidator<UserEdit>
    {
        private readonly ScopeOptions _scope;
        private readonly List<string> _clientRoles;

        public UserValidator(DataContext dataContext, ScopeOptions scope, bool isInsert)
        {
            _scope = scope;
            _clientRoles = dataContext.Roles.Where(r => r.ApplicationId == Application.CLIENT_ID).Select(r => r.Name).ToList();

            if (!isInsert)
                RuleFor(u => u.Id).NotEmpty();

            RuleFor(u => u.LastName).NotEmpty().WithName("Last Name");
            RuleFor(u => u.UserTypeId).NotEmpty().WithName("User Type");
            RuleFor(u => u.BranchId).BranchMustBeInScope(dataContext, scope);
            RuleFor(u => u.Email).NotEmpty().EmailAddress();
            RuleFor(u => u.Scope).IsInEnum();
            RuleFor(u => u.Scope).Must(s => Convert.ToInt32(s) >= Convert.ToInt32(scope.Scope)).WithMessage("Scope must be equal or to less than yours");
            RuleFor(u => u).Must(MustNotBeUserScope).WithMessage("Only Organisation or Branch Scope Allowed");

            RuleFor(u => u.Email)
                .NotEmpty()
                .EmailAddress();

            RuleFor(x => x.Roles)
                .NotEmpty()
                .WithMessage("Please add at least 1 role");

            RuleFor(x => x.Roles)
                .Must(MustHaveOneClientRole)
                .WithMessage("Please select at least 1 Client role");

            RuleForEach(x => x.Roles)
                .NotEmpty()
                .WithName("Roles");

            RuleForEach(x => x.Aliases)
               .NotEmpty()
               .WithName("Aliases");
        }

        private bool MustNotBeUserScope(UserEdit user)
        {
            return _scope.Scope != Scope.User;
        }

        private bool MustHaveOneClientRole(IEnumerable<string> roles)
        {
            return roles.Any(r => _clientRoles.Contains(r));
        }
    }
}