
using System;
using System.Collections.Generic;
using System.Linq;
using FluentValidation;
using OneAdvisor.Data;
using OneAdvisor.Model.Directory.Model.Organisation;
using OneAdvisor.Model.Directory.Model.Organisation.Configuration;

namespace OneAdvisor.Service.Directory.Validators
{
    public class OrganisationValidator : AbstractValidator<OrganisationEdit>
    {
        public OrganisationValidator(DataContext dataContext, bool isInsert)
        {
            if (!isInsert)
                RuleFor(o => o.Id).NotEmpty();

            RuleFor(o => o.Name).NotEmpty().MaximumLength(32);
            RuleFor(o => o.Config).NotNull();
            RuleFor(t => t.Config).SetValidator(new ConfigValidator(dataContext));
        }
    }

    public class ConfigValidator : AbstractValidator<Config>
    {
        private List<Guid> _companyIds;

        public ConfigValidator(DataContext dataContext)
        {
            _companyIds = dataContext.Company.Select(c => c.Id).ToList();

            RuleFor(t => t.CompanyIds).NotEmpty();
            RuleFor(t => t.CompanyIds).Must(BeValidCompanyIds).WithMessage("There are invalid company ids");
        }

        private bool BeValidCompanyIds(IEnumerable<Guid> companyIds)
        {
            return companyIds.Intersect(_companyIds).Count() == companyIds.Count();
        }
    }
}