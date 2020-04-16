
using System;
using System.Linq;
using FluentValidation;
using FluentValidation.Results;
using FluentValidation.Validators;
using OneAdvisor.Data;
using OneAdvisor.Model.Account.Model.Authentication;
using OneAdvisor.Model.Client.Model.Policy.Merge;
using OneAdvisor.Service.Common.Query;

namespace OneAdvisor.Service.Client.Validators
{
    public class MergePoliciesValidator : AbstractValidator<MergePolicies>
    {
        private readonly DataContext _context;
        private readonly ScopeOptions _scope;

        public MergePoliciesValidator(DataContext dataContext, ScopeOptions scope)
        {
            _context = dataContext;
            _scope = scope;

            RuleFor(m => m.SourcePolicyIds).NotEmpty().WithName("Source Policy Ids");
            When(m => m.SourcePolicyIds.Any(), () =>
            {
                RuleFor(m => m).Custom(SourcePolicyIdsInScope);
            });


            RuleFor(m => m.TargetPolicy).NotNull().WithName("Target Policy");
            When(m => m.TargetPolicy != null, () =>
            {
                RuleFor(m => m).Custom(TargetPolicyNumberExistsInSource);
                RuleFor(m => m).Custom(AllCompaniesMatch);
            });
        }

        private void TargetPolicyNumberExistsInSource(MergePolicies merge, CustomContext context)
        {
            var idNumbers = _context.Policy.Where(m => merge.SourcePolicyIds.Contains(m.Id)).Select(m => m.Number).ToList();

            if (!idNumbers.Any(m => m == merge.TargetPolicy.Number))
            {
                var failure = new ValidationFailure("Number", "Policy Number must be equal to one of the existing Policy Numbers", merge.TargetPolicy.Number);
                context.AddFailure(failure);
            }
        }

        private void AllCompaniesMatch(MergePolicies merge, CustomContext context)
        {
            var policyQuery = from policy in _context.Policy
                              select policy;

            var policies = policyQuery.Where(m => merge.SourcePolicyIds.Contains(m.Id)).ToList();

            if (policies.Select(p => p.CompanyId).Any(id => id != merge.TargetPolicy.CompanyId))
            {
                var failure = new ValidationFailure("CompanyId", "Source and Merged Policies must all be for the same company", merge.TargetPolicy.CompanyId);
                context.AddFailure(failure);
            }
        }

        private void SourcePolicyIdsInScope(MergePolicies merge, CustomContext context)
        {
            var userQuery = ScopeQuery.GetUserEntityQuery(_context, _scope);

            var policyQuery = from policy in _context.Policy
                              select policy;

            var policies = policyQuery.Where(m => merge.SourcePolicyIds.Contains(m.Id)).ToList();

            if (policies.Count != merge.SourcePolicyIds.Count)
            {
                var failure = new ValidationFailure("SourcePolicyIds", "Invalid Source Policy Ids");
                context.AddFailure(failure);
            }
        }
    }
}