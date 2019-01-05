using FluentValidation;
using OneAdvisor.Model.Directory.Model.Lookup;

namespace OneAdvisor.Service.Directory.Validators.Lookup
{
    public class CompanyValidator : AbstractValidator<Company>
    {
        public CompanyValidator(bool isInsert)
        {
            if (!isInsert)
                RuleFor(o => o.Id).NotEmpty();

            RuleFor(o => o.Name).NotEmpty().MaximumLength(32);
        }
    }
}