
using System.Collections.Generic;
using System.Linq;
using FluentValidation;
using OneAdvisor.Model.Directory.Model.Organisation;
using OneAdvisor.Service.Common;

namespace OneAdvisor.Service.Directory.Validators
{
    public class OrganisationValidator : AbstractValidator<Organisation>
    {
        public OrganisationValidator(bool isInsert)
        {
            if (!isInsert)
                RuleFor(o => o.Id).Custom(Validation.GuidNotEmpty);

            RuleFor(o => o.Name).NotEmpty().MaximumLength(32);
        }
    }
}