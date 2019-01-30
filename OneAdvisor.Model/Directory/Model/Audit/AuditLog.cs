using System;

namespace OneAdvisor.Model.Directory.Model.Audit
{
    public class AuditLog
    {
        public Guid Id { get; set; }
        public string Data { get; set; }
        public string Entity { get; set; }
        public string Action { get; set; }
        public DateTime Date { get; set; }
        public string UserId { get; set; }
    }
}