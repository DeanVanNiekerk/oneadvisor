using System;
using System.Dynamic;

namespace OneAdvisor.Model.Directory.Model.Audit
{
    public class AuditLog
    {
        public AuditLog()
        {
            Date = DateTime.UtcNow;
        }

        public Guid? Id { get; set; }
        public Guid? UserId { get; set; }
        public DateTime Date { get; set; }
        public string Action { get; set; }
        public string Entity { get; set; }
        public dynamic Data { get; set; }
    }
}