using System;
using System.ComponentModel.DataAnnotations;

namespace OneAdvisor.Data.Entities.Directory
{
    public class AuditLogEntity
    {
        [Key]
        public Guid Id { get; set; }
        public Guid? UserId { get; set; }
        [Required]
        public DateTime Date { get; set; }
        [Required]
        public string Action { get; set; }
        public string Entity { get; set; }
        public dynamic Data { get; set; }

        public virtual UserEntity User { get; set; }
    }
}