using System;
using OneAdvisor.Model.Common;
using OneAdvisor.Model.Directory.Model.Auth;

namespace OneAdvisor.Model.Directory.Model.Audit
{
    public class AuditLogQueryOptions : QueryOptionsBase
    {
        public AuditLogQueryOptions(ScopeOptions scope, string sortColumn, string sortDirection, int pageSize, int pageNumber, string filters = null)
         : base(sortColumn, sortDirection, pageSize, pageNumber, filters)
        {
            Scope = scope;

            var result = GetFilterValue<string>("UserId");
            if (result.Success)
                UserId = result.Value;

            result = GetFilterValue<string>("Entity");
            if (result.Success)
                Entity = result.Value;

            result = GetFilterValue<string>("Action");
            if (result.Success)
                Action = result.Value;
        }

        public ScopeOptions Scope { get; set; }
        public string UserId { get; set; }
        public string Entity { get; set; }
        public string Action { get; set; }
    }
}