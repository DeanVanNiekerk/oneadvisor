using System;
using System.Collections.Generic;
using OneAdvisor.Model.Common;
using OneAdvisor.Model.Directory.Model.Auth;

namespace OneAdvisor.Model.Member.Model.Member
{
    public class MemberQueryOptions : QueryOptionsBase
    {
        public MemberQueryOptions(ScopeOptions scope, string sortColumn, string sortDirection, int pageSize, int pageNumber, string filters = null)
         : base(sortColumn, sortDirection, pageSize, pageNumber, filters)
        {
            Scope = scope;
            UserIds = new List<string>();

            var result = GetFilterValue<string>("FirstName");
            if (result.Success)
                FirstName = result.Value;

            result = GetFilterValue<string>("LastName");
            if (result.Success)
                LastName = result.Value;

            result = GetFilterValue<string>("IdNumber");
            if (result.Success)
                IdNumber = result.Value;

            UserIds = new List<string>();
            var results = GetFilterValues<string>("UserId");
            if (results.Success)
                UserIds = results.Value;
        }

        public ScopeOptions Scope { get; set; }

        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string IdNumber { get; set; }
        public List<string> UserIds { get; set; }
    }
}
