
using System;
using System.Collections.Generic;
using System.Linq;
using FluentValidation;
using FluentValidation.Results;
using FluentValidation.Validators;
using OneAdvisor.Data;
using OneAdvisor.Data.Entities.Client;
using OneAdvisor.Model.Account.Model.Authentication;
using OneAdvisor.Model.Client.Model.Client;
using OneAdvisor.Model.Client.Model.Lookup;
using OneAdvisor.Service.Common;
using OneAdvisor.Service.Common.Query;

namespace OneAdvisor.Service.Client.Validators
{
    public class ClientValidator : AbstractValidator<ClientEdit>
    {
        private readonly DataContext _context;
        private readonly ScopeOptions _scope;
        private readonly bool _isInsert;

        public ClientValidator(DataContext dataContext, ScopeOptions scope, bool isInsert)
        {
            _context = dataContext;
            _scope = scope;
            _isInsert = isInsert;

            if (!isInsert)
                RuleFor(m => m.Id).NotEmpty();

            RuleFor(m => m.ClientTypeId).NotEmpty().WithName("Client Type");
            RuleFor(m => m.FirstName).MaximumLength(128).WithName("First Name");
            RuleFor(m => m.LastName).MaximumLength(128).WithName("Last Name");
            RuleFor(m => m.TaxNumber).MaximumLength(128).WithName("Tax Number");

            When(m => !string.IsNullOrWhiteSpace(m.IdNumber), () =>
            {
                RuleFor(m => m.IdNumber).Must(BeValidIdNumber).WithMessage("Invalid ID Number");

                RuleSet("Availability", () =>
                {
                    RuleFor(m => m).Custom(AvailableIdNumberValidator);
                });
            });

            When(m => !string.IsNullOrWhiteSpace(m.AlternateIdNumber), () =>
            {
                RuleFor(m => m.AlternateIdNumber).MaximumLength(128).WithName(client => GetAlternateIdNumberLabel(client));

                RuleSet("Availability", () =>
                {
                    RuleFor(m => m).Custom(AvailableAlternateIdNumberValidator);
                });
            });

            When(m => m.ClientTypeId == ClientType.CLIENT_TYPE_INDIVIDUAL && string.IsNullOrWhiteSpace(m.IdNumber) && string.IsNullOrWhiteSpace(m.AlternateIdNumber), () =>
            {
                RuleFor(m => m.IdNumber).NotEmpty().WithMessage(client => IdNumberOrAlternateIdNumberRequiredMessage(client));
                RuleFor(m => m.AlternateIdNumber).NotEmpty().WithMessage(client => IdNumberOrAlternateIdNumberRequiredMessage(client));
            });

            When(m => m.ClientTypeId != ClientType.CLIENT_TYPE_INDIVIDUAL, () =>
            {
                RuleFor(m => m.AlternateIdNumber).NotEmpty().WithName(client => GetAlternateIdNumberLabel(client));
            });
        }

        private string IdNumberOrAlternateIdNumberRequiredMessage(ClientEdit client)
        {
            var label = GetAlternateIdNumberLabel(client);
            return $"ID Number or {label} is required";
        }

        private bool BeValidIdNumber(string idNumber)
        {
            var id = new IdNumber(idNumber);
            return id.IsValid;
        }

        private void AvailableIdNumberValidator(ClientEdit client, CustomContext context)
        {
            if (!IsAvailableIdNumber(client))
            {
                var failure = new ValidationFailure("IdNumber", "ID Number is already in use", client.IdNumber);
                context.AddFailure(failure);
            }
        }

        private bool IsAvailableIdNumber(ClientEdit client)
        {
            var entity = GetClientEntityQuery().Where(m => m.IdNumber == client.IdNumber).FirstOrDefault();

            if (entity == null)
                return true;

            if (!client.Id.HasValue || _isInsert)
                return entity == null;

            return client.Id == entity.Id;
        }

        private void AvailableAlternateIdNumberValidator(ClientEdit client, CustomContext context)
        {
            if (!IsAvailableAlternateIdNumber(client))
            {
                var label = GetAlternateIdNumberLabel(client);
                var failure = new ValidationFailure("AlternateIdNumber", $"{label} is already in use", client.AlternateIdNumber);
                context.AddFailure(failure);
            }
        }

        private bool IsAvailableAlternateIdNumber(ClientEdit client)
        {
            var entity = GetClientEntityQuery().Where(m => m.AlternateIdNumber == client.AlternateIdNumber).FirstOrDefault();

            if (entity == null)
                return true;

            if (!client.Id.HasValue || _isInsert)
                return entity == null;

            return client.Id == entity.Id;
        }

        private string GetAlternateIdNumberLabel(ClientEdit client)
        {
            if (client.ClientTypeId == ClientType.CLIENT_TYPE_INDIVIDUAL)
                return "Passport Number";

            return "Registration Number";
        }

        private IQueryable<ClientEntity> GetClientEntityQuery()
        {
            return ScopeQuery.GetClientEntityQuery(_context, _scope);
        }
    }
}