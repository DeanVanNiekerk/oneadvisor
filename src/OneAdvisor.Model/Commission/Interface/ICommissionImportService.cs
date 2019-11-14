using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using OneAdvisor.Model.Commission.Model.ImportCommission;
using OneAdvisor.Model.Account.Model.Authentication;

namespace OneAdvisor.Model.Commission.Interface
{
    public interface ICommissionImportService
    {
        Task<ImportResult> ImportCommissions(ScopeOptions scope, Guid commissionStatementId, IEnumerable<ImportCommission> importData);
    }
}