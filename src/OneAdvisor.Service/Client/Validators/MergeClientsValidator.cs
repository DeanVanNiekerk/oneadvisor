
using System;
using System.Linq;
using FluentValidation;
using FluentValidation.Results;
using FluentValidation.Validators;
using OneAdvisor.Data;
using OneAdvisor.Model.Account.Model.Authentication;
using OneAdvisor.Model.Client.Model.Client.Merge;
using OneAdvisor.Service.Common.Query;

namespace OneAdvisor.Service.Client.Validators
{
    public class MergeClientsValidator : AbstractValidator<MergeClients>
    {
        private readonly DataContext _context;
        private readonly ScopeOptions _scope;

        public MergeClientsValidator(DataContext dataContext, ScopeOptions scope)
        {
            _context = dataContext;
            _scope = scope;

            RuleFor(m => m.SourceClientIds).NotEmpty().WithName("Source Client Ids");
            When(m => m.SourceClientIds.Any(), () =>
            {
                RuleFor(m => m).Custom(SourceClientIdsInScope);
            });


            RuleFor(m => m.TargetClient).NotNull().WithName("Target Client");
            When(m => m.TargetClient != null, () =>
            {
                RuleFor(m => m).Custom(TargetIdNumberExistsInSource);
            });
        }

        private void TargetIdNumberExistsInSource(MergeClients merge, CustomContext context)
        {
            var idNumbers = _context.Client.Where(m => merge.SourceClientIds.Contains(m.Id)).Select(m => m.IdNumber).ToList();

            if (!idNumbers.Any(m => m == merge.TargetClient.IdNumber))
            {
                var failure = new ValidationFailure("IdNumber", "ID Number must be equal to one of the existing client ID Numbers", merge.TargetClient.IdNumber);
                context.AddFailure(failure);
            }
        }

        private void SourceClientIdsInScope(MergeClients merge, CustomContext context)
        {
            var clients = ScopeQuery.GetClientEntityQuery(_context, _scope).Where(m => merge.SourceClientIds.Contains(m.Id)).ToList();

            if (clients.Count != merge.SourceClientIds.Count)
            {
                var failure = new ValidationFailure("SourceClientIds", "Invalid Source Client Ids");
                context.AddFailure(failure);
            }
        }
    }
}