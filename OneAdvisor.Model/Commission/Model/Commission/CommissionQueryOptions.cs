using System;
using System.Collections.Generic;
using OneAdvisor.Model.Common;
using OneAdvisor.Model.Directory.Model.Auth;

namespace OneAdvisor.Model.Commission.Model.Commission
{
    public class CommissionQueryOptions : QueryOptionsBase
    {
        public CommissionQueryOptions(ScopeOptions scope, string sortColumn, string sortDirection, int pageSize, int pageNumber, string filters = null)
        : base(sortColumn, sortDirection, pageSize, pageNumber, filters)
        {
            Scope = scope;

            UserId = new List<string>();

            var results = GetFilterValues<string>("UserId");
            if (results.Success)
                UserId = results.Value;
        }

        public ScopeOptions Scope { get; set; }

        public List<string> UserId { get; set; }
    }
}