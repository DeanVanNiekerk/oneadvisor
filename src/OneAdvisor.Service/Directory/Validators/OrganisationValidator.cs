
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
        private List<Guid> _applicationIds;

        public OrganisationValidator(DataContext dataContext, bool isInsert, Guid? organisationId)
        {
            _applicationIds = dataContext.Application.Select(a => a.Id).ToList();

            if (!isInsert)
                RuleFor(o => o.Id).NotEmpty();

            RuleFor(o => o.Name).NotEmpty().MaximumLength(32);
            RuleFor(o => o.Config).NotNull();
            RuleFor(o => o.Config).SetValidator(new ConfigValidator(dataContext, isInsert, organisationId));

            RuleFor(o => o.ApplicationIds).NotEmpty().WithMessage("Please select at least 1 application"); ;
            RuleFor(o => o.ApplicationIds).Must(BeValidApplicationIds).WithMessage("There are invalid application ids");
            RuleFor(o => o.ApplicationIds).Must(HaveClientApplication).WithMessage("The Client application must be selected");
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

    public class ConfigValidator : AbstractValidator<Config>
    {
        private List<Guid> _companyIds;
        private List<Guid> _licenseCategoryIds;
        private List<Guid> _userLicenseCategoryIds;

        public ConfigValidator(DataContext dataContext, bool isInsert, Guid? organisationId)
        {
            _companyIds = dataContext.Company.Select(c => c.Id).ToList();
            _licenseCategoryIds = dataContext.LicenseCategory.Select(c => c.Id).ToList();

            RuleFor(c => c.CompanyIds).NotEmpty().WithMessage("Please select at least 1 company");
            RuleFor(c => c.CompanyIds).Must(BeValidCompanyIds).WithMessage("There are invalid company ids");

            RuleFor(c => c.Funds).Must(HaveUnqiueFunds).WithMessage("There are duplicate funds");

            RuleFor(c => c.HasSharesInProductProvidersTarget).NotEmpty().When(c => c.HasSharesInProductProviders).WithMessage("This field is required");
            RuleFor(c => c.HasReceivedCommissionFromCompaniesTarget).NotEmpty().When(c => c.HasReceivedCommissionFromCompanies).WithMessage("This field is required");

            RuleFor(c => c.LicenseCategoryIds).Must(BeValidLicenseCategoryIds).WithMessage("There are invalid license category ids");

            if (!isInsert)
            {
                var query = from user in dataContext.Users
                            join branch in dataContext.Branch
                                on user.BranchId equals branch.Id
                            where branch.OrganisationId == organisationId.Value
                            select user.Config;

                //Get unique list of user license category ids
                _userLicenseCategoryIds = query.ToList().SelectMany(c => c.LicenseCategoryIds).Distinct().ToList();

                RuleFor(c => c.LicenseCategoryIds).Must(BeHaveAllUserLicenseCategoryIds).WithMessage("There are missing license categories that are assigned to users");
            }
        }

        private bool BeValidCompanyIds(IEnumerable<Guid> companyIds)
        {
            return companyIds.Intersect(_companyIds).Count() == companyIds.Count();
        }

        private bool HaveUnqiueFunds(IEnumerable<string> funds)
        {
            return funds.Distinct().Count() == funds.Count();
        }

        private bool BeValidLicenseCategoryIds(IEnumerable<Guid> licenseCategoryIds)
        {
            return licenseCategoryIds.Intersect(_licenseCategoryIds).Count() == licenseCategoryIds.Count();
        }

        private bool BeHaveAllUserLicenseCategoryIds(IEnumerable<Guid> licenseCategoryIds)
        {
            return _userLicenseCategoryIds.All(id => licenseCategoryIds.Contains(id));
        }

    }
}