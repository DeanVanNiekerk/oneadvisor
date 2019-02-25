using System;
using System.Collections.Generic;
using OneAdvisor.Model.Common;
using OneAdvisor.Model.Account.Model.Authentication;

namespace OneAdvisor.Model.Directory.Model.Audit
{
    public class AuditLogQueryOptions : QueryOptionsBase
    {
        public AuditLogQueryOptions(ScopeOptions scope, string sortColumn, string sortDirection, int pageSize, int pageNumber, string filters = null)
         : base(sortColumn, sortDirection, pageSize, pageNumber, filters)
        {
            Scope = scope;
            UserId = new List<Guid>();
            Action = new List<string>();

            var resultGuids = GetFilterValues<Guid>("UserId");
            if (resultGuids.Success)
                UserId = resultGuids.Value;

            var results = GetFilterValues<string>("Action");
            if (results.Success)
                Action = results.Value;

            var result = GetFilterValue<string>("Entity");
            if (result.Success)
                Entity = result.Value;
        }

        public ScopeOptions Scope { get; set; }
        public List<Guid> UserId { get; set; }
        public List<string> Action { get; set; }
        public string Entity { get; set; }
    }
}