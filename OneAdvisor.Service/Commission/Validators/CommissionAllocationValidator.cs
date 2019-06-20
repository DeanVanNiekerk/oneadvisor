
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using FluentValidation;
using FluentValidation.Results;
using FluentValidation.Validators;
using Microsoft.EntityFrameworkCore;
using OneAdvisor.Data;
using OneAdvisor.Model.Account.Model.Authentication;
using OneAdvisor.Model.Commission.Model.CommissionAllocation;
using OneAdvisor.Service.Common;

namespace OneAdvisor.Service.Commission.Validators
{
    public class CommissionAllocationValidator : AbstractValidator<CommissionAllocationEdit>
    {
        private readonly ScopeOptions _scope;
        private readonly DataContext _context;

        public CommissionAllocationValidator(DataContext dataContext, ScopeOptions scope, bool isInsert)
        {
            _context = dataContext;
            _scope = scope;

            if (!isInsert)
                RuleFor(o => o.Id).NotEmpty();

            RuleFor(o => o.FromClientId).ClientMustBeInScope(dataContext, scope);
            RuleFor(o => o.ToClientId).ClientMustBeInScope(dataContext, scope);
            RuleFor(o => o.PolicyIds).NotEmpty().WithName("Policies");
            RuleFor(o => o).CustomAsync(ValidatePolicyIds);
        }

        private async Task ValidatePolicyIds(CommissionAllocationEdit allocation, CustomContext context, CancellationToken token)
        {
            var existing = await _context.Policy
                           .Where(p => p.ClientId == allocation.FromClientId)
                           .Select(p => p.Id)
                           .ToListAsync();

            var success = allocation.PolicyIds.All(p => existing.Contains(p));

            if (!success)
            {
                var failure = new ValidationFailure("PolicyIds", "There are invalid Policy Ids");
                context.AddFailure(failure);
            }
        }
    }
}