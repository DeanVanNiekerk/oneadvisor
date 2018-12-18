using System;
using System.Threading.Tasks;
using OneAdvisor.Model.Common;
using OneAdvisor.Model.Member.Model.Member;

namespace OneAdvisor.Model.Member.Interface
{
    public interface IMemberService
    {
        Task<PagedItems<Model.Member.Member>> GetMembers(MemberQueryOptions queryOptions);
        Task<MemberEdit> GetMember(Guid organisationId, Guid id);
        Task<Result> UpdateMember(Guid organisationId, MemberEdit member);
        Task<Result> InsertMember(Guid organisationId, MemberEdit member);
    }
}