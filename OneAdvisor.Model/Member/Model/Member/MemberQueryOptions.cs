using OneAdvisor.Model.Common;

namespace OneAdvisor.Model.Member.Model.Member
{
    public class MemberQueryOptions : QueryOptionsBase
    {
        public MemberQueryOptions(string sortColumn, string sortDirection, int pageSize, int pageNumber)
         : base(sortColumn, sortDirection, pageSize, pageNumber)
        {
        }
    }
}
