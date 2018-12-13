using System;
using System.Threading.Tasks;
using OneAdvisor.Model.Common;
using OneAdvisor.Model.Member.Interface;
using OneAdvisor.Model.Member.Model.Member;

namespace OneAdvisor.Service.Member
{
    public class MemberService : IMemberService
    {
        public Task<MemberEdit> GetMember(Guid id)
        {
            throw new NotImplementedException();
        }

        public Task<PagedItems<Model.Member.Model.Member.Member>> GetMembers(MemberQueryOptions queryOptions)
        {
            throw new NotImplementedException();
        }

        public Task<Result> InsertMember(MemberEdit member)
        {
            throw new NotImplementedException();
        }

        public Task<Result> UpdateMember(MemberEdit member)
        {
            throw new NotImplementedException();
        }
    }
}