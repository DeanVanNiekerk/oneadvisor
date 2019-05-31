using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using OneAdvisor.Model.Account.Model.Authentication;
using OneAdvisor.Model.Commission.Model.CommissionError;
using OneAdvisor.Model.Common;
using OneAdvisor.Model.Directory.Model.User;

namespace OneAdvisor.Model.Commission.Interface
{
    public interface ICommissionErrorService
    {
        Task<CommissionErrorEdit> GetNextError(ScopeOptions scope, Guid commissionStatementId, bool hasValidFormat);
        Task<CommissionErrorEdit> GetError(ScopeOptions scope, Guid commissionErrorId);
        Task<Result> DeleteError(ScopeOptions scope, Guid commissionErrorId);
        Task<Result> ResolveFormatError(ScopeOptions scope, CommissionErrorEdit error);
        Task<Result> ResolveMappingError(ScopeOptions scope, CommissionErrorEdit error);
        Task AutoResolveMappingErrors(ScopeOptions scope, Guid commissionStatementId, Guid policyId);
        Task<PagedItems<CommissionError>> GetErrors(CommissionErrorQueryOptions options);
    }
}