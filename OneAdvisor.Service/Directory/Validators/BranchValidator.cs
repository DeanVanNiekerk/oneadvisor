
using System.Collections.Generic;
using System.Linq;
using FluentValidation;
using OneAdvisor.Model.Directory.Model.Branch;
using OneAdvisor.Service.Common;

namespace OneAdvisor.Service.Directory.Validators
{
    public class BranchValidator : AbstractValidator<Branch>
    {
        public BranchValidator(bool isInsert)
        {
            if (!isInsert)
                RuleFor(o => o.Id).NotEmpty();

            RuleFor(o => o.OrganisationId).NotEmpty().WithName("Organisation");
            RuleFor(o => o.Name).NotEmpty().MaximumLength(32); ;
        }
    }
}