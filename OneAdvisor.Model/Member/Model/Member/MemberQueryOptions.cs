using System;
using System.Collections.Generic;
using OneAdvisor.Model.Common;
using OneAdvisor.Model.Account.Model.Authentication;

namespace OneAdvisor.Model.Member.Model.Member
{
    public class MemberQueryOptions : QueryOptionsBase
    {
        public MemberQueryOptions(ScopeOptions scope, string sortColumn, string sortDirection, int pageSize, int pageNumber, string filters = null)
         : base(sortColumn, sortDirection, pageSize, pageNumber, filters)
        {
            Scope = scope;

            MemberId = new List<Guid>();

            var result = GetFilterValue<string>("FirstName");
            if (result.Success)
                FirstName = result.Value;

            result = GetFilterValue<string>("LastName");
            if (result.Success)
                LastName = result.Value;

            result = GetFilterValue<string>("IdNumber");
            if (result.Success)
                IdNumber = result.Value;

            var resultGuids = GetFilterValues<Guid>("MemberId");
            if (resultGuids.Success)
                MemberId = resultGuids.Value;
        }

        public ScopeOptions Scope { get; set; }

        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string IdNumber { get; set; }
        public List<Guid> MemberId { get; set; }
    }
}
