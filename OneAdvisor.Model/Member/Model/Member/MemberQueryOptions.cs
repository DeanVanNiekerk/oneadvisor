using OneAdvisor.Model.Common;

namespace OneAdvisor.Model.Member.Model.Member
{
    public class MemberQueryOptions : QueryOptionsBase
    {
        public MemberQueryOptions(int pageSize, int pageNumber)
         : base(pageSize, pageNumber)
        {
            //Defaults
            SortOptions.Column = "LastName";
        }
    }
}
