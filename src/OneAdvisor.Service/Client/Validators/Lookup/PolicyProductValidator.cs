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
    public class PolicyProductValidator : AbstractValidator<PolicyProduct>
    {
        private readonly DataContext _context;

        public PolicyProductValidator(DataContext dataContext, bool isInsert)
        {
            _context = dataContext;

            if (!isInsert)
                RuleFor(o => o.Id).NotEmpty();

            RuleFor(t => t.PolicyProductTypeId).NotEmpty().WithName("Policy Product Type");
            RuleFor(t => t.CompanyId).NotEmpty().WithName("Company");
            RuleFor(t => t.Name).NotEmpty().MaximumLength(128);
            RuleFor(t => t.Code).NotEmpty().MaximumLength(128);
            RuleFor(t => t).Custom(AvailableCodeValidator);
        }

        private void AvailableCodeValidator(PolicyProduct policyProduct, CustomContext context)
        {
            if (!IsAvailableCode(policyProduct))
            {
                var failure = new ValidationFailure("Code", "Code is already in use", policyProduct.Code);
                context.AddFailure(failure);
            }
        }

        private bool IsAvailableCode(PolicyProduct policyProduct)
        {
            if (string.IsNullOrEmpty(policyProduct.Code))
                return true;

            var query = from type in _context.PolicyProduct
                        where EF.Functions.Like(type.Code, policyProduct.Code)
                        select type;

            var entity = query.FirstOrDefault();

            if (entity == null)
                return true;

            if (!policyProduct.Id.HasValue)
                return entity == null;

            return policyProduct.Id == entity.Id;
        }
    }
}