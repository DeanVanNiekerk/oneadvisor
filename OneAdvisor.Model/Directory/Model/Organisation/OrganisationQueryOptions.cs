using OneAdvisor.Model.Common;

namespace OneAdvisor.Model.Directory.Model.Organisation
{
    public class OrganisationQueryOptions : QueryOptionsBase
    {
        public OrganisationQueryOptions(int pageSize, int pageNumber)
         : base("Name", "asc", pageSize, pageNumber)
        { }
    }
}