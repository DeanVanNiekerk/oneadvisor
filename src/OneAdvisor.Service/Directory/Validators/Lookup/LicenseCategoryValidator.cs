using FluentValidation;
using OneAdvisor.Model.Directory.Model.Lookup;

namespace OneAdvisor.Service.Directory.Validators.Lookup
{
    public class LicenseCategoryValidator : AbstractValidator<LicenseCategory>
    {
        public LicenseCategoryValidator(bool isInsert)
        {
            if (!isInsert)
                RuleFor(o => o.Id).NotEmpty();

            RuleFor(o => o.Code).NotEmpty().MaximumLength(128);
            RuleFor(o => o.Name).NotEmpty().MaximumLength(128);
        }
    }
}