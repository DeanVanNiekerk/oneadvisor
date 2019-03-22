using System;
using System.Threading.Tasks;
using OneAdvisor.Model.Common;
using OneAdvisor.Model.Account.Model.Authentication;
using OneAdvisor.Model.Member.Model.Member;
using OneAdvisor.Model.Member.Model.Merge;

namespace OneAdvisor.Model.Member.Interface
{
    public interface IMemberService
    {
        Task<PagedItems<Model.Member.Member>> GetMembers(MemberQueryOptions queryOptions);
        Task<MemberEdit> GetMember(ScopeOptions scope, Guid id);
        Task<MemberPreview> GetMemberPreview(ScopeOptions scope, Guid id);
        Task<Result> DeleteMember(ScopeOptions scope, Guid memberId);
        Task<Result> UpdateMember(ScopeOptions scope, MemberEdit member);
        Task<Result> InsertMember(ScopeOptions scope, MemberEdit member);
        Task<Result> MergeMembers(ScopeOptions scope, MergeMembers merge);
    }
}