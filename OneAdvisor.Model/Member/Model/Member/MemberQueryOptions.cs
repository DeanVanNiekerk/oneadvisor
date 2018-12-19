using System;
using OneAdvisor.Model.Common;

namespace OneAdvisor.Model.Member.Model.Member
{
    public class MemberQueryOptions : QueryOptionsBase
    {
        public MemberQueryOptions(Guid organisationId, string sortColumn, string sortDirection, int pageSize, int pageNumber, string filters = null)
         : base(sortColumn, sortDirection, pageSize, pageNumber, filters)
        {
            OrganisationId = organisationId;

            var result = GetFilterValue<string>("FirstName");
            if (result.Success)
                FirstName = result.Value;

            result = GetFilterValue<string>("LastName");
            if (result.Success)
                LastName = result.Value;

            result = GetFilterValue<string>("IdNumber");
            if (result.Success)
                IdNumber = result.Value;

        }

        public Guid OrganisationId { get; set; }

        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string IdNumber { get; set; }

    }
}
