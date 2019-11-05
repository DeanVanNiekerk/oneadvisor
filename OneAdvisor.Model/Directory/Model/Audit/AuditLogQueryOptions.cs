using System;
using System.Collections.Generic;
using OneAdvisor.Model.Common;
using OneAdvisor.Model.Account.Model.Authentication;

namespace OneAdvisor.Model.Directory.Model.Audit
{
    public class AuditLogQueryOptions : QueryOptionsBase<AuditLog>
    {
        public AuditLogQueryOptions(ScopeOptions scope, string sortColumn, string sortDirection, string filters = null)
         : base(sortColumn, sortDirection, 0, 0, filters)
        {
            Scope = scope;
            UserId = new List<Guid>();
            Action = new List<string>();
            StartDate = DateTime.UtcNow.AddDays(-14);
            EndDate = DateTime.UtcNow;

            var resultGuids = GetFilterValues<Guid>("UserId");
            if (resultGuids.Success)
                UserId = resultGuids.Value;

            var results = GetFilterValues<string>("Action");
            if (results.Success)
                Action = results.Value;

            var result = GetFilterValue<string>("Entity");
            if (result.Success)
                Entity = result.Value;

            var resultDateTime = GetFilterValue<DateTime>("StartDate");
            if (resultDateTime.Success)
                StartDate = resultDateTime.Value;

            resultDateTime = GetFilterValue<DateTime>("EndDate");
            if (resultDateTime.Success)
                EndDate = resultDateTime.Value;
        }

        public ScopeOptions Scope { get; set; }
        public List<Guid> UserId { get; set; }
        public List<string> Action { get; set; }
        public string Entity { get; set; }

        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
    }
}