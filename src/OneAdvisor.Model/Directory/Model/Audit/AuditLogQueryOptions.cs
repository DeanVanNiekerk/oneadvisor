using System;
using System.Collections.Generic;
using OneAdvisor.Model.Common;
using OneAdvisor.Model.Account.Model.Authentication;

namespace OneAdvisor.Model.Directory.Model.Audit
{
    public class AuditLogQueryOptions : QueryOptionsBase<AuditLog>
    {
        public AuditLogQueryOptions(ScopeOptions scope, string filters = null)
         : base("", "", 0, 0, filters)
        {
            Scope = scope;
            UserId = new List<Guid>();
            Action = new List<string>();
            Entity = new List<string>();
            EntityId = new List<string>();

            var resultGuids = GetFilterValues<Guid>("UserId");
            if (resultGuids.Success)
                UserId = resultGuids.Value;

            var results = GetFilterValues<string>("Action");
            if (results.Success)
                Action = results.Value;

            var result = GetFilterValues<string>("Entity");
            if (result.Success)
                Entity = result.Value;

            result = GetFilterValues<string>("EntityId");
            if (result.Success)
                EntityId = result.Value;

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
        public List<string> Entity { get; set; }
        public List<string> EntityId { get; set; }

        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
    }
}