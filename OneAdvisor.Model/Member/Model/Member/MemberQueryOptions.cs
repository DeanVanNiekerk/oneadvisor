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
            FirstName = GetFilterValue<string>("FirstName");
            LastName = GetFilterValue<string>("LastName");
            IdNumber = GetFilterValue<string>("IdNumber");
        }

        public Guid OrganisationId { get; set; }

        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string IdNumber { get; set; }

    }
}
