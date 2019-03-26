
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
                RuleFor(o => o.Id).NotEmpty();

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

            When(m => !string.IsNullOrWhiteSpace(m.PassportNumber), () =>
            {
                RuleFor(m => m.PassportNumber).MaximumLength(128).WithName("Passport Number");

                RuleSet("Availability", () =>
                {
                    RuleFor(m => m).Custom(AvailablePassportNumberValidator);
                });

            });


            When(m => string.IsNullOrWhiteSpace(m.IdNumber) && string.IsNullOrWhiteSpace(m.PassportNumber), () =>
            {
                RuleFor(m => m.IdNumber).NotEmpty().WithMessage("ID Number or Passport Number is required");
            });
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

        private void AvailablePassportNumberValidator(ClientEdit client, CustomContext context)
        {
            if (!IsAvailablePassportNumber(client))
            {
                var failure = new ValidationFailure("PassportNumber", "Passport Number is already in use", client.PassportNumber);
                context.AddFailure(failure);
            }
        }

        private bool IsAvailablePassportNumber(ClientEdit client)
        {
            var entity = GetClientEntityQuery().Where(m => m.PassportNumber == client.PassportNumber).FirstOrDefault();

            if (entity == null)
                return true;

            if (!client.Id.HasValue || _isInsert)
                return entity == null;

            return client.Id == entity.Id;
        }

        private IQueryable<ClientEntity> GetClientEntityQuery()
        {
            return ScopeQuery.GetClientEntityQuery(_context, _scope);
        }
    }
}