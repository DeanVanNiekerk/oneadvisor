using System;
using System.ComponentModel.DataAnnotations;
using OneAdvisor.Data.Entities.Directory.Lookup;
using OneAdvisor.Data.Entities.Member;

namespace OneAdvisor.Data.Entities.Commission
{
    public class CommissionEntity
    {
        [Key]
        public Guid Id { get; set; }
        [Required]
        public Guid PolicyId { get; set; }
        [Required]
        public Guid CommissionTypeId { get; set; }
        [Required]
        public decimal AmountIncludingVAT { get; set; }
        [Required]
        public decimal VAT { get; set; }


        public virtual PolicyEntity Policy { get; set; }
        public virtual CommissionTypeEntity CommissionType { get; set; }
    }
}