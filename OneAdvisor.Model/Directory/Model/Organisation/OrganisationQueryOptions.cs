using OneAdvisor.Model.Common;

namespace OneAdvisor.Model.Directory.Model.Organisation
{
    public class OrganisationQueryOptions: QueryOptionsBase
    {
       public OrganisationQueryOptions(int pageSize, int pageNumber)
        : base(pageSize, pageNumber)
       {
           //Defaults
           SortOptions.Column = "Name";
       }
    }
}