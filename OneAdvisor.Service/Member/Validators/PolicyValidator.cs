using System;
using System.Linq;
using FluentValidation;
using FluentValidation.Results;
using FluentValidation.Validators;
using OneAdvisor.Data;
using OneAdvisor.Model.Directory.Model.Auth;
using OneAdvisor.Model.Directory.Model.User;
using OneAdvisor.Model.Member.Model.Policy;
using OneAdvisor.Service.Common;
using OneAdvisor.Service.Common.Query;

namespace OneAdvisor.Service.Member.Validators
{
    public class PolicyValidator : AbstractValidator<PolicyEdit>
    {
        private readonly ScopeOptions _scope;
        private readonly DataContext _context;

        public PolicyValidator(DataContext dataContext, ScopeOptions scope, bool isInsert)
        {
            _context = dataContext;
            _scope = scope;

            if (!isInsert)
                RuleFor(p => p.Id).GuidNotEmpty();

            RuleFor(p => p.UserId).NotEmpty().MaximumLength(64).WithName("Broker");
            RuleFor(p => p.Number).NotEmpty().MaximumLength(128);
            RuleFor(p => p.Premium).LessThanOrEqualTo(999999999);
            RuleFor(p => p).Custom(AvailablePolicyNumberValidator);

            RuleFor(p => p.CompanyId).GuidNotEmpty("Company");
        }

        private void AvailablePolicyNumberValidator(PolicyEdit policy, CustomContext context)
        {
            if (!IsAvailablePolicyNumber(policy))
            {
                var failure = new ValidationFailure("Number", "Policy Number is already in use", policy.Number);
                context.AddFailure(failure);
            }
        }

        private bool IsAvailablePolicyNumber(PolicyEdit policy)
        {
            if (string.IsNullOrEmpty(policy.Number))
                return true;

            var query = from user in ScopeQuery.GetUserEntityQuery(_context, _scope)
                        join policyEntity in _context.Policy
                            on user.Id equals policyEntity.UserId
                        where policyEntity.Number == policy.Number
                        && policyEntity.CompanyId == policy.CompanyId
                        select policyEntity;

            var entity = query.FirstOrDefault();

            if (entity == null)
                return true;

            if (policy.Id == default(Guid))
                return entity == null;

            return policy.Id == entity.Id;
        }

    }
}