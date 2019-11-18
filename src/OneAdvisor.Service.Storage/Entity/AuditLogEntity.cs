using System;
using Microsoft.WindowsAzure.Storage.Table;

namespace OneAdvisor.Service.Storage.Entity
{
    public class AuditLogEntity : TableEntity
    {
        public AuditLogEntity()
        { }

        public AuditLogEntity(Guid? organisationGuid)
        {
            RowKey = Guid.NewGuid().ToString();
            PartitionKey = organisationGuid.HasValue ? organisationGuid.Value.ToString() : "global";
        }

        public string UserId { get; set; }
        public string BranchId { get; set; }
        public string Action { get; set; }
        public string Entity { get; set; }
        public string EntityId { get; set; }
        public string Data { get; set; }
    }
}