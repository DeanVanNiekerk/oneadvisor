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
using Microsoft.EntityFrameworkCore;
using OneAdvisor.Service.Client.Query;

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
            RuleFor(p => p)
                .Custom((policy, context) =>
                {
                    if (!policy.CompanyId.HasValue)
                        return;

                    if (!IsAvailablePolicyNumber(policy.CompanyId.Value, policy.Id, policy.Number))
                    {
                        var failure = new ValidationFailure("Number", "Policy Number is already in use", policy.Number);
                        context.AddFailure(failure);
                    }
                });

            RuleForEach(p => p.NumberAliases)
               .Custom((policyNumber, context) =>
               {
                   var policy = ((PolicyEdit)context.ParentContext.InstanceToValidate);
                   if (!IsAvailablePolicyNumber(policy.CompanyId.Value, policy.Id, policyNumber))
                   {
                       var failure = new ValidationFailure(context.PropertyName, "Policy Number is already in use", policyNumber);
                       context.AddFailure(failure);
                   }
               });
        }

        private bool IsAvailablePolicyNumber(Guid companyId, Guid? policyId, string policyNumber)
        {
            var query = from user in ScopeQuery.GetUserEntityQuery(_context, _scope.Clone(Scope.Organisation))
                        join policy in _context.Policy
                            on user.Id equals policy.UserId
                        where policy.CompanyId == policy.CompanyId
                        select policy;

            query = query.WherePolicyNumberEquals(policyNumber);

            var entity = query.FirstOrDefault();

            if (entity == null)
                return true;

            if (!policyId.HasValue || _isInsert)
                return entity == null;

            return policyId == entity.Id;
        }

    }
}