using System;
using System.ComponentModel.DataAnnotations;

namespace OneAdvisor.Data.Entities.Directory.Lookup
{
    public class VATRateEntity
    {
        [Key]
        public Guid Id { get; set; }
        [Required]
        public decimal Rate { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
    }
}