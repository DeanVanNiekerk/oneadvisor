using FluentValidation;
using OneAdvisor.Data;
using System.Linq;
using OneAdvisor.Service.Common;
using Microsoft.EntityFrameworkCore;
using FluentValidation.Validators;
using FluentValidation.Results;
using OneAdvisor.Model.Client.Model.Lookup;

namespace OneAdvisor.Service.Client.Validators.Lookup
{
    public class PolicyProductTypeValidator : AbstractValidator<PolicyProductType>
    {
        private readonly DataContext _context;

        public PolicyProductTypeValidator(DataContext dataContext, bool isInsert)
        {
            _context = dataContext;

            if (!isInsert)
                RuleFor(o => o.Id).NotEmpty();

            RuleFor(t => t.PolicyTypeId).NotEmpty().WithName("Policy Type");
            RuleFor(t => t.Name).NotEmpty().MaximumLength(128);
            RuleFor(t => t.Code).NotEmpty().MaximumLength(128);
            RuleFor(t => t).Custom(AvailableCodeValidator);
        }

        private void AvailableCodeValidator(PolicyProductType policyProductType, CustomContext context)
        {
            if (!IsAvailableCode(policyProductType))
            {
                var failure = new ValidationFailure("Code", "Code is already in use", policyProductType.Code);
                context.AddFailure(failure);
            }
        }

        private bool IsAvailableCode(PolicyProductType policyProductType)
        {
            if (string.IsNullOrEmpty(policyProductType.Code))
                return true;

            var query = from type in _context.PolicyProductType
                        where EF.Functions.Like(type.Code, policyProductType.Code)
                        select type;

            var entity = query.FirstOrDefault();

            if (entity == null)
                return true;

            if (!policyProductType.Id.HasValue)
                return entity == null;

            return policyProductType.Id == entity.Id;
        }
    }
}