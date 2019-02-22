using System;
using System.ComponentModel.DataAnnotations;

namespace OneAdvisor.Data.Entities.Directory
{
    public class AuditLogEntity
    {
        [Key]
        public Guid Id { get; set; }
        public string Data { get; set; }
        public string Entity { get; set; }
        public string Action { get; set; }
        public DateTime Date { get; set; }
        public Guid UserId { get; set; }
    }
}