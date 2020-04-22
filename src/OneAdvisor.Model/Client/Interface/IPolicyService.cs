using System;
using System.Threading.Tasks;
using OneAdvisor.Model.Common;
using OneAdvisor.Model.Account.Model.Authentication;
using OneAdvisor.Model.Client.Model.Policy;
using OneAdvisor.Model.Client.Model.Policy.Merge;

namespace OneAdvisor.Model.Client.Interface
{
    public interface IPolicyService
    {
        Task<PagedItems<Policy>> GetPolicies(PolicyQueryOptions queryOptions);
        Task<PolicyEdit> GetPolicy(ScopeOptions scope, Guid id);
        Task<PolicyEdit> GetPolicy(ScopeOptions scope, string number);
        Task<PolicyEdit> GetPolicy(ScopeOptions scope, Guid companyId, string number);
        Task<PolicyEdit> GetPolicy(ScopeOptions scope, Guid clientId, Guid companyId, string number);
        Task<Result> UpdatePolicy(ScopeOptions scope, PolicyEdit policy);
        Task<Result> InsertPolicy(ScopeOptions scope, PolicyEdit policy);
        Task<Result> MergePolicies(ScopeOptions scope, MergePolicies merge);
    }
}