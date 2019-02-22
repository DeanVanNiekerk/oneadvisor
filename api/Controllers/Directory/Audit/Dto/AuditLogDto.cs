using System;

namespace api.Controllers.Directory.Audit.Dto
{
    public class AuditLogDto
    {
        public Guid Id { get; set; }
        public string Data { get; set; }
        public string Entity { get; set; }
        public string Action { get; set; }
        public DateTime Date { get; set; }
        public Guid UserId { get; set; }
    }
}