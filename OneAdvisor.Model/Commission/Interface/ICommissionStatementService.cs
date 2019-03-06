using System;
using System.Threading.Tasks;
using OneAdvisor.Model.Commission.Model.CommissionStatement;
using OneAdvisor.Model.Common;
using OneAdvisor.Model.Account.Model.Authentication;

namespace OneAdvisor.Model.Commission.Interface
{
    public interface ICommissionStatementService
    {
        Task<PagedCommissionStatements> GetCommissionStatements(CommissionStatementQueryOptions queryOptions);
        Task<CommissionStatementEdit> GetCommissionStatement(ScopeOptions scope, Guid id);
        Task<Result> UpdateCommissionStatement(ScopeOptions scope, CommissionStatementEdit commission);
        Task<Result> InsertCommissionStatement(ScopeOptions scope, CommissionStatementEdit commission);
        Task DeleteCommissions(ScopeOptions scope, Guid commissionStatementId);
    }
}