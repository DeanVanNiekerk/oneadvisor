using System;
using System.ComponentModel.DataAnnotations;

namespace OneAdvisor.Data.Entities.Directory
{
    public class AuditLogEntity
    {
        [Key]
        public Guid Id { get; set; }
        public string AuditData { get; set; }
        public string EntityType { get; set; }
        public DateTime AuditDate { get; set; }
        public string AuditUser { get; set; }
    }
}