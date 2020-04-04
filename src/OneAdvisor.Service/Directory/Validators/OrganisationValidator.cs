
using System;
using System.Collections.Generic;
using System.Linq;
using FluentValidation;
using OneAdvisor.Data;
using OneAdvisor.Model.Directory.Model.Application;
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
        private List<Guid> _applicationIds;

        public ConfigValidator(DataContext dataContext)
        {
            _companyIds = dataContext.Company.Select(c => c.Id).ToList();
            _applicationIds = dataContext.Application.Select(a => a.Id).ToList();

            RuleFor(t => t.CompanyIds).NotEmpty().WithMessage("Please select at least 1 company");
            RuleFor(t => t.CompanyIds).Must(BeValidCompanyIds).WithMessage("There are invalid company ids");

            RuleFor(t => t.ApplicationIds).NotEmpty().WithMessage("Please select at least 1 application"); ;
            RuleFor(t => t.ApplicationIds).Must(BeValidApplicationIds).WithMessage("There are invalid application ids");
            RuleFor(t => t.ApplicationIds).Must(HaveClientApplication).WithMessage("The Client application must be selected");
        }

        private bool BeValidCompanyIds(IEnumerable<Guid> companyIds)
        {
            return companyIds.Intersect(_companyIds).Count() == companyIds.Count();
        }

        private bool BeValidApplicationIds(IEnumerable<Guid> applicationIds)
        {
            return applicationIds.Intersect(_applicationIds).Count() == applicationIds.Count();
        }

        private bool HaveClientApplication(IEnumerable<Guid> applicationIds)
        {
            return applicationIds.Any(a => a == Application.CLIENT_ID);
        }
    }
}