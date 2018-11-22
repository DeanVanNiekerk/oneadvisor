using OneAdvisor.Model.Common;

namespace OneAdvisor.Model.Directory.Model.User
{
    public class UserQueryOptions: QueryOptionsBase
    {
       public UserQueryOptions(int pageSize, int pageNumber)
        : base(pageSize, pageNumber)
       {
           //Defaults
           SortOptions.Column = "FirstName";
       }
    }
}