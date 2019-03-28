using System.Collections.Generic;
using System.Threading.Tasks;
using OneAdvisor.Model.Common;
using OneAdvisor.Model.Directory.Model.Lookup;

namespace OneAdvisor.Model.Directory.Interface
{
    public interface ILookupService
    {
        List<CommissionStatementTemplateFieldName> GetCommissionStatementTemplateFieldNames();

        Task<List<Company>> GetCompanies();
        Task<Result> UpdateCompany(Company model);
        Task<Result> InsertCompany(Company model);

        Task<List<CommissionType>> GetCommissionTypes();
        Task<CommissionType> GetCommissionType(string code);
        Task<Result> UpdateCommissionType(CommissionType model);
        Task<Result> InsertCommissionType(CommissionType model);

        Task<List<CommissionEarningsType>> GetCommissionEarningsTypes();
    }
}