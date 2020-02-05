using System;
using System.Linq;
using FluentValidation;
using FluentValidation.Results;
using FluentValidation.Validators;
using OneAdvisor.Data;
using OneAdvisor.Model.Account.Model.Authentication;
using OneAdvisor.Model.Directory.Model.User;
using OneAdvisor.Model.Client.Model.Policy;
using OneAdvisor.Service.Common;
using OneAdvisor.Service.Common.Query;
using System.Collections.Generic;

namespace OneAdvisor.Service.Client.Validators
{
    public class PolicyValidator : AbstractValidator<PolicyEdit>
    {
        private readonly ScopeOptions _scope;
        private readonly DataContext _context;
        private readonly bool _isInsert;

        public PolicyValidator(DataContext dataContext, ScopeOptions scope, bool isInsert)
        {
            _context = dataContext;
            _scope = scope;
            _isInsert = isInsert;

            if (!isInsert)
                RuleFor(p => p.Id).NotEmpty();

            RuleFor(p => p.UserId).UserMustBeInScope(dataContext, scope);
            RuleFor(p => p.ClientId).ClientMustBeInScope(dataContext, scope);
            RuleFor(p => p.Number).NotEmpty().MaximumLength(128);
            RuleFor(p => p.Premium).InclusiveBetween(0, 999999999);
            RuleFor(p => p.CompanyId).NotEmpty().WithName("Company");
            RuleFor(p => p).Custom(AvailablePolicyNumberValidator);
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
            var policyNumbers = new List<string>();

            if (!string.IsNullOrEmpty(policy.Number))
                policyNumbers.Add(policy.Number);

            if (policy.NumberAliases.Any())
                policyNumbers.AddRange(policy.NumberAliases);

            var query = from user in ScopeQuery.GetUserEntityQuery(_context, _scope)
                        join policyEntity in _context.Policy
                            on user.Id equals policyEntity.UserId
                        where policyNumbers.Contains(policy.Number) //Case insensitive
                        && policyEntity.CompanyId == policy.CompanyId
                        select policyEntity;

            var entity = query.FirstOrDefault();

            if (entity == null)
                return true;

            if (!policy.Id.HasValue || _isInsert)
                return entity == null;

            return policy.Id == entity.Id;
        }

    }
}