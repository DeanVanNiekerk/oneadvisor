using System;
using OneAdvisor.Model.Common;

namespace OneAdvisor.Model.Directory.Model.Branch
{
    public class BranchQueryOptions : QueryOptionsBase
    {
        public BranchQueryOptions(string filters = null)
         : base("Name", "desc", 0, 0, filters)
        {
            var result = GetFilterValue<Guid>("OrganisationId");
            if (result.Success)
                OrganisationId = result.Value;
        }

        public Guid? OrganisationId { get; set; }
    }
}