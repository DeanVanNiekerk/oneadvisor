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
                RuleFor(o => o.Id).GuidNotEmpty();

            RuleFor(o => o.Name).NotEmpty().MaximumLength(32);
        }
    }
}