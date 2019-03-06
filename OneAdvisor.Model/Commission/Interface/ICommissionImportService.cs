using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using OneAdvisor.Model.Commission.Model.CommissionStatement;
using OneAdvisor.Model.Commission.Model.ImportCommission;
using OneAdvisor.Model.Common;
using OneAdvisor.Model.Account.Model.Authentication;
using OneAdvisor.Model.Directory.Model.Lookup;

namespace OneAdvisor.Model.Commission.Interface
{
    public interface ICommissionImportService
    {
        Task<List<Result>> ImportCommissions(ScopeOptions scope, Guid commissionStatementId, IEnumerable<ImportCommission> importData);
    }
}