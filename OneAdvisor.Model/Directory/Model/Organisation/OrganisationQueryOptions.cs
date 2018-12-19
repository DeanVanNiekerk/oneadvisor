using OneAdvisor.Model.Common;

namespace OneAdvisor.Model.Directory.Model.Organisation
{
    public class OrganisationQueryOptions : QueryOptionsBase
    {
        public OrganisationQueryOptions()
         : base("Name", "desc", 0, 0)
        { }
    }
}