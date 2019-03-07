using FluentValidation;
using OneAdvisor.Data;
using System.Linq;
using OneAdvisor.Model.Directory.Model.Lookup;
using OneAdvisor.Service.Common;
using Microsoft.EntityFrameworkCore;
using FluentValidation.Validators;
using FluentValidation.Results;

namespace OneAdvisor.Service.Directory.Validators.Lookup
{
    public class CommissionTypeValidator : AbstractValidator<CommissionType>
    {
        private readonly DataContext _context;

        public CommissionTypeValidator(DataContext dataContext, bool isInsert)
        {
            _context = dataContext;

            if (!isInsert)
                RuleFor(o => o.Id).NotEmpty();

            RuleFor(t => t.PolicyTypeId).NotEmpty().WithName("Policy Type");
            RuleFor(t => t.CommissionEarningsTypeId).NotEmpty().WithName("Earnings Type");
            RuleFor(t => t.Name).NotEmpty().MaximumLength(128);
            RuleFor(t => t.Code).NotEmpty().MaximumLength(128);
            RuleFor(t => t).Custom(AvailableCodeValidator);
        }

        private void AvailableCodeValidator(CommissionType commissionType, CustomContext context)
        {
            if (!IsAvailableCode(commissionType))
            {
                var failure = new ValidationFailure("Code", "Code is already in use", commissionType.Code);
                context.AddFailure(failure);
            }
        }

        private bool IsAvailableCode(CommissionType commissionType)
        {
            if (string.IsNullOrEmpty(commissionType.Code))
                return true;

            var query = from type in _context.CommissionType
                        where EF.Functions.Like(type.Code, commissionType.Code)
                        select type;

            var entity = query.FirstOrDefault();

            if (entity == null)
                return true;

            if (!commissionType.Id.HasValue)
                return entity == null;

            return commissionType.Id == entity.Id;
        }
    }
}