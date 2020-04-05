using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using OneAdvisor.Model.Common;
using OneAdvisor.Model.Directory.Model.Lookup;

namespace OneAdvisor.Model.Directory.Interface
{
    public interface IDirectoryLookupService
    {
        Task<List<Company>> GetCompanies();
        Task<Company> GetCompany(Guid id);
        Task<Result> UpdateCompany(Company model);
        Task<Result> InsertCompany(Company model);

        Task<List<AdviceScope>> GetAdviceScopes();
        Task<Result> UpdateAdviceScope(AdviceScope model);
        Task<Result> InsertAdviceScope(AdviceScope model);


        Task<List<AdviceService>> GetAdviceServices();
        Task<Result> UpdateAdviceService(AdviceService model);
        Task<Result> InsertAdviceService(AdviceService model);


        Task<List<LicenseCategory>> GetLicenseCategories();
        Task<Result> UpdateLicenseCategory(LicenseCategory model);
        Task<Result> InsertLicenseCategory(LicenseCategory model);

        Task<List<UserType>> GetUserTypes();

        Task<decimal> GetVATRate(DateTime date);
    }
}