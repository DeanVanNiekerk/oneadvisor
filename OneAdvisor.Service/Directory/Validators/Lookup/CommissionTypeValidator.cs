using FluentValidation;
using OneAdvisor.Model.Directory.Model.Lookup;
using OneAdvisor.Service.Common;

namespace OneAdvisor.Service.Directory.Validators.Lookup
{
    public class CommissionTypeValidator : AbstractValidator<CommissionType>
    {
        public CommissionTypeValidator(bool isInsert)
        {
            if (!isInsert)
                RuleFor(o => o.Id).NotEmpty();

            RuleFor(o => o.PolicyTypeId).NotEmpty().WithName("Policy Type");
            RuleFor(o => o.Name).NotEmpty().MaximumLength(128);
            RuleFor(o => o.Code).NotEmpty().MaximumLength(128);
        }
    }
}