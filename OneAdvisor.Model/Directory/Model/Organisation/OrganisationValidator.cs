
using System.Collections.Generic;
using System.Linq;
using FluentValidation;

namespace OneAdvisor.Model.Directory.Model.Organisation
{
    public class OrganisationValidator: AbstractValidator<Organisation>
    {
        public OrganisationValidator(bool isInsert)
        {
            if(!isInsert)
                RuleFor(o => o.Id).NotEmpty();

            RuleFor(o => o.Name).NotEmpty();
        }
    }
}