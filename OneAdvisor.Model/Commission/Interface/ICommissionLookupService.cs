using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using OneAdvisor.Model.Common;
using OneAdvisor.Model.Commission.Model.Lookup;

namespace OneAdvisor.Model.Commission.Interface
{
    public interface ICommissionLookupService
    {
        List<CommissionStatementTemplateFieldName> GetCommissionStatementTemplateFieldNames();

        Task<List<CommissionType>> GetCommissionTypes();
        Task<CommissionType> GetCommissionType(string code);
        Task<Result> UpdateCommissionType(CommissionType model);
        Task<Result> InsertCommissionType(CommissionType model);

        Task<List<CommissionEarningsType>> GetCommissionEarningsTypes();
    }
}