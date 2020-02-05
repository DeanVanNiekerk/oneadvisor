using System;
using System.ComponentModel.DataAnnotations;
using OneAdvisor.Data.Entities.Client;
using OneAdvisor.Model.Commission.Model.ImportCommission;
using OneAdvisor.Data.Entities.Commission.Lookup;
using OneAdvisor.Data.Entities.Directory;

namespace OneAdvisor.Data.Entities.Commission
{
    public class CommissionEntity
    {
        [Key]
        public Guid Id { get; set; }
        [Required]
        public Guid CommissionStatementId { get; set; }
        [Required]
        public Guid PolicyId { get; set; }
        [Required]
        public Guid UserId { get; set; }
        [Required]
        public Guid CommissionTypeId { get; set; }
        [Required]
        public decimal AmountIncludingVAT { get; set; }
        [Required]
        public decimal VAT { get; set; }
        public Guid? SplitGroupId { get; set; }
        public ImportCommission SourceData { get; set; }

        public virtual CommissionStatementEntity CommissionStatement { get; set; }
        public virtual PolicyEntity Policy { get; set; }
        public virtual CommissionTypeEntity CommissionType { get; set; }
        public virtual UserEntity User { get; set; }
    }
}