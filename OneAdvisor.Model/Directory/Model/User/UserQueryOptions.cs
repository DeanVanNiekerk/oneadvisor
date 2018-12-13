using OneAdvisor.Model.Common;

namespace OneAdvisor.Model.Directory.Model.User
{
    public class UserQueryOptions : QueryOptionsBase
    {
        public UserQueryOptions(int pageSize, int pageNumber)
         : base("LastName", "asc", pageSize, pageNumber)
        { }
    }
}