using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using OneAdvisor.Data.Entities.Member;

namespace OneAdvisor.Data.Entities.Directory.Lookup
{
    public class PolicyTypeEntity
    {
        [Key]
        public Guid Id { get; set; }
        [Required]
        public string Name { get; set; }

        public virtual ICollection<CommissionTypeEntity> CommissionTypes { get; set; }
    }
}