using System;
using FluentValidation;
using FluentValidation.Results;
using OneAdvisor.Model.Member.Model.Policy;

namespace OneAdvisor.Service.Member.Validators
{
    public class PolicyValidator : AbstractValidator<PolicyEdit>
    {
        public PolicyValidator(bool isInsert)
        {
            if (!isInsert)
                RuleFor(p => p.Id).NotEmpty();

            RuleFor(p => p.UserId).NotEmpty().MaximumLength(64);
            RuleFor(p => p.Number).NotEmpty().MaximumLength(32);

            RuleFor(p => p.CompanyId).Custom((guid, context) =>
            {
                if (guid == default(Guid))
                {
                    var failure = new ValidationFailure("CompanyId", "'CompanyId' must not be empty.", "");
                    context.AddFailure(failure);
                }
            });
        }

    }
}