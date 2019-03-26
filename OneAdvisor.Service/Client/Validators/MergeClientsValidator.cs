
using System;
using System.Collections.Generic;
using System.Linq;
using FluentValidation;
using FluentValidation.Results;
using FluentValidation.Validators;
using Microsoft.EntityFrameworkCore;
using OneAdvisor.Data;
using OneAdvisor.Data.Entities.Client;
using OneAdvisor.Model.Account.Model.Authentication;
using OneAdvisor.Model.Client.Model.Client;
using OneAdvisor.Model.Client.Model.Merge;
using OneAdvisor.Service.Common;
using OneAdvisor.Service.Common.Query;

namespace OneAdvisor.Service.Client.Validators
{
    public class MergeClientsValidator : AbstractValidator<MergeClients>
    {
        private readonly DataContext _context;

        public MergeClientsValidator(DataContext dataContext)
        {
            _context = dataContext;

            RuleFor(m => m.SourceClientIds).NotEmpty().WithName("Source Client Ids");
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
    }
}