using System;
using System.Threading.Tasks;
using OneAdvisor.Model.Commission.Model.CommissionError;
using OneAdvisor.Model.Common;
using OneAdvisor.Model.Directory.Model.Auth;
using OneAdvisor.Model.Directory.Model.User;

namespace OneAdvisor.Model.Commission.Interface
{
    public interface ICommissionErrorService
    {
        Task<CommissionError> GetNextError(ScopeOptions scope, Guid commissionStatementId, bool hasValidFormat);
        Task<Result> ResolveFormatError(ScopeOptions scope, CommissionError error);
        Task<Result> ResolveMappingError(ScopeOptions scope, CommissionError error);
    }
}