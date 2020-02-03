using System;
using System.ComponentModel.DataAnnotations;

namespace OneAdvisor.Data.Entities.Commission.Lookup
{
    public class CommissionEarningsTypeEntity
    {
        [Key]
        public Guid Id { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        public int DisplayOrder { get; set; }
    }
}