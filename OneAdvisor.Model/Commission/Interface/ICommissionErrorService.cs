using System;
using System.Threading.Tasks;
using OneAdvisor.Model.Account.Model.Authentication;
using OneAdvisor.Model.Commission.Model.CommissionError;
using OneAdvisor.Model.Common;
using OneAdvisor.Model.Directory.Model.User;

namespace OneAdvisor.Model.Commission.Interface
{
    public interface ICommissionErrorService
    {
        Task<CommissionError> GetNextError(ScopeOptions scope, Guid commissionStatementId, bool hasValidFormat);
        Task<Result> ResolveFormatError(ScopeOptions scope, CommissionError error);
        Task<Result> ResolveMappingError(ScopeOptions scope, CommissionError error);
        Task AutoResolveMappingErrors(ScopeOptions scope, Guid commissionStatementId, Guid policyId);
    }
}