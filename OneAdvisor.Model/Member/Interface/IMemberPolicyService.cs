using System;
using System.Threading.Tasks;
using OneAdvisor.Model.Common;
using OneAdvisor.Model.Directory.Model.Authentication;
using OneAdvisor.Model.Member.Model.Policy;

namespace OneAdvisor.Model.Member.Interface
{
    public interface IPolicyService
    {
        Task<PagedItems<Policy>> GetPolicies(PolicyQueryOptions queryOptions);
        Task<PolicyEdit> GetPolicy(ScopeOptions scope, Guid id);
        Task<PolicyEdit> GetPolicy(ScopeOptions scope, string number);
        Task<PolicyEdit> GetPolicy(ScopeOptions scope, Guid companyId, string number);
        Task<PolicyEdit> GetPolicy(ScopeOptions scope, Guid memberId, Guid companyId, string number);
        Task<Result> UpdatePolicy(ScopeOptions scope, PolicyEdit policy);
        Task<Result> InsertPolicy(ScopeOptions scope, PolicyEdit policy);
    }
}