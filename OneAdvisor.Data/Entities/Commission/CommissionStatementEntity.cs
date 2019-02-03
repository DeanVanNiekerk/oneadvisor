using System;
using System.ComponentModel.DataAnnotations;
using OneAdvisor.Data.Entities.Directory.Lookup;
using OneAdvisor.Data.Entities.Member;

namespace OneAdvisor.Data.Entities.Commission
{
    public class CommissionStatementEntity
    {
        [Key]
        public Guid Id { get; set; }
        [Required]
        public Guid CompanyId { get; set; }
        [Required]
        public decimal AmountIncludingVAT { get; set; }
        [Required]
        public decimal VAT { get; set; }
        [Required]
        public DateTime Date { get; set; }
        [Required]
        public bool Processed { get; set; }

        public virtual CompanyEntity Company { get; set; }
    }
}