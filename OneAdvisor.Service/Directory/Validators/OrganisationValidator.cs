
using FluentValidation;
using OneAdvisor.Model.Directory.Model.Organisation;

namespace OneAdvisor.Service.Directory.Validators
{
    public class OrganisationValidator : AbstractValidator<OrganisationEdit>
    {
        public OrganisationValidator(bool isInsert)
        {
            if (!isInsert)
                RuleFor(o => o.Id).NotEmpty();

            RuleFor(o => o.Name).NotEmpty().MaximumLength(32);
            RuleFor(o => o.OrganisationCompanyIds).NotEmpty().WithName("Company");
        }
    }
}