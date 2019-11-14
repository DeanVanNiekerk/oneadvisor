
using FluentValidation;
using OneAdvisor.Model.Directory.Model.Branch;
using OneAdvisor.Data;
using OneAdvisor.Model.Account.Model.Authentication;
using FluentValidation.Validators;
using OneAdvisor.Model.Directory.Model.User;
using FluentValidation.Results;

namespace OneAdvisor.Service.Directory.Validators
{
    public class BranchValidator : AbstractValidator<Branch>
    {
        private readonly ScopeOptions _scope;

        public BranchValidator(DataContext dataContext, ScopeOptions scope, bool isInsert)
        {
            _scope = scope;

            if (!isInsert)
            {
                RuleFor(o => o.Id).NotEmpty();
                RuleFor(m => m).Custom(MustBeInOrganisationOrBranchScope);
            }
            else
            {
                RuleFor(m => m).Custom(MustBeInOrganisationScope);
            }

            RuleFor(o => o.OrganisationId).NotEmpty().WithName("Organisation");
            RuleFor(o => o.OrganisationId).OrganisationMustBeInScope(dataContext, scope);
            RuleFor(o => o.Name).NotEmpty().MaximumLength(32);
        }

        private void MustBeInOrganisationScope(Branch branch, CustomContext context)
        {
            //Only organisation scope
            if (_scope.Scope != Scope.Organisation)
            {
                var failure = new ValidationFailure("", "Only Organisation Scope Allowed");
                context.AddFailure(failure);
            }
        }

        private void MustBeInOrganisationOrBranchScope(Branch branch, CustomContext context)
        {
            //Only organisation scope
            if (_scope.Scope != Scope.Organisation && _scope.Scope != Scope.Branch)
            {
                var failure = new ValidationFailure("", "Only Organisation or Branch Scope Allowed");
                context.AddFailure(failure);
            }
        }
    }
}