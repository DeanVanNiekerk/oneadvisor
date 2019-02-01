
using System;
using System.Collections.Generic;
using System.Linq;
using FluentValidation;
using FluentValidation.Results;
using FluentValidation.Validators;
using OneAdvisor.Data;
using OneAdvisor.Data.Entities.Member;
using OneAdvisor.Model.Directory.Model.Auth;
using OneAdvisor.Model.Member.Model.Member;
using OneAdvisor.Service.Common;
using OneAdvisor.Service.Common.Query;

namespace OneAdvisor.Service.Member.Validators
{
    public class MemberValidator : AbstractValidator<MemberEdit>
    {
        private readonly DataContext _context;
        private readonly ScopeOptions _scope;

        public MemberValidator(DataContext dataContext, ScopeOptions scope, bool isInsert)
        {
            _context = dataContext;
            _scope = scope;

            if (!isInsert)
                RuleFor(o => o.Id).NotEmpty();

            RuleFor(m => m.FirstName).MaximumLength(128).WithName("First Name");
            RuleFor(m => m.LastName).MaximumLength(128).WithName("Last Name");
            RuleFor(m => m.TaxNumber).MaximumLength(128).WithName("Tax Number");

            When(m => !string.IsNullOrWhiteSpace(m.IdNumber), () =>
            {
                RuleFor(m => m.IdNumber).Must(BeValidIdNumber).WithMessage("Invalid ID Number");
                RuleFor(m => m).Custom(AvailableIdNumberValidator);
            });

            When(m => !string.IsNullOrWhiteSpace(m.PassportNumber), () =>
            {
                RuleFor(m => m.PassportNumber).MaximumLength(128).WithName("Passport Number");
                RuleFor(m => m).Custom(AvailablePassportNumberValidator);
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

        private void AvailableIdNumberValidator(MemberEdit member, CustomContext context)
        {
            if (!IsAvailableIdNumber(member))
            {
                var failure = new ValidationFailure("IdNumber", "ID Number is already in use", member.IdNumber);
                context.AddFailure(failure);
            }
        }

        private bool IsAvailableIdNumber(MemberEdit member)
        {
            var entity = GetMemberEntityQuery().Where(m => m.IdNumber == member.IdNumber).FirstOrDefault();

            if (entity == null)
                return true;

            if (member.Id == default(Guid))
                return entity == null;

            return member.Id == entity.Id;
        }

        private void AvailablePassportNumberValidator(MemberEdit member, CustomContext context)
        {
            if (!IsAvailablePassportNumber(member))
            {
                var failure = new ValidationFailure("PassportNumber", "Passport Number is already in use", member.PassportNumber);
                context.AddFailure(failure);
            }
        }

        private bool IsAvailablePassportNumber(MemberEdit member)
        {
            var entity = GetMemberEntityQuery().Where(m => m.PassportNumber == member.PassportNumber).FirstOrDefault();

            if (entity == null)
                return true;

            if (member.Id == default(Guid))
                return entity == null;

            return member.Id == entity.Id;
        }

        private IQueryable<MemberEntity> GetMemberEntityQuery()
        {
            return ScopeQuery.GetMemberEntityQuery(_context, _scope);
        }
    }
}