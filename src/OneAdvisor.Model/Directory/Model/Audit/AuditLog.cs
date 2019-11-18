using System;

namespace OneAdvisor.Model.Directory.Model.Audit
{
    public class AuditLog
    {
        public static string ACTION_INSERT = "Insert";
        public static string ACTION_UPDATE = "Update";
        public static string ACTION_DELETE = "Delete";

        public Guid? Id { get; set; }
        public Guid? UserId { get; set; }
        public Guid? BranchId { get; set; }
        public DateTime Date { get; set; }
        public string Action { get; set; }
        public string Entity { get; set; }
        public string EntityId { get; set; }
        public dynamic Data { get; set; }
    }
}