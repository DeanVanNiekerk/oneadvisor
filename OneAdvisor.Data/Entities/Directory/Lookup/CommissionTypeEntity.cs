using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using OneAdvisor.Data.Entities.Member;

namespace OneAdvisor.Data.Entities.Directory.Lookup
{
    public class CommissionTypeEntity
    {
        [Key]
        public Guid Id { get; set; }
        [Required]
        public Guid PolicyTypeId { get; set; }
        [Required]
        public Guid CommissionEarningsTypeId { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        public string Code { get; set; }

        public virtual PolicyTypeEntity PolicyType { get; set; }
        public virtual CommissionEarningsTypeEntity CommissionEarningsType { get; set; }
    }
}