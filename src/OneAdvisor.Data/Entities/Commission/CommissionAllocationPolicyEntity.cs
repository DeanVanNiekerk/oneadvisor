using System;
using System.ComponentModel.DataAnnotations;
using OneAdvisor.Data.Entities.Client;

namespace OneAdvisor.Data.Entities.Commission
{
    public class CommissionAllocationPolicyEntity
    {
        [Key]
        public Guid Id { get; set; }
        [Required]
        public Guid CommissionAllocationId { get; set; }
        [Required]
        public Guid PolicyId { get; set; }

        public virtual CommissionAllocationEntity CommissionAllocation { get; set; }
        public virtual PolicyEntity Policy { get; set; }
    }
}