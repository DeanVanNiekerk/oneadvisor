using System;
using System.Threading.Tasks;
using OneAdvisor.Model.Common;
using OneAdvisor.Model.Directory.Model.Auth;
using OneAdvisor.Model.Member.Model.MemberPolicy;

namespace OneAdvisor.Model.Member.Interface
{
    public interface IMemberPolicyService
    {
        Task<PagedItems<MemberPolicy>> GetPolicies(MemberPolicyQueryOptions queryOptions);
        Task<MemberPolicyEdit> GetPolicy(ScopeOptions scope, Guid id);
        Task<MemberPolicyEdit> GetPolicy(ScopeOptions scope, string number);
        Task<Result> UpdatePolicy(ScopeOptions scope, MemberPolicyEdit policy);
        Task<Result> InsertPolicy(ScopeOptions scope, MemberPolicyEdit policy);
    }
}