using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using OneAdvisor.Data.Entities.Client;

namespace OneAdvisor.Data.Entities.Commission
{
    public class CommissionAllocationEntity
    {
        [Key]
        public Guid Id { get; set; }
        [Required]
        public Guid FromClientId { get; set; }
        [Required]
        public Guid ToClientId { get; set; }

        public virtual ClientEntity FromClient { get; set; }
        public virtual ClientEntity ToClient { get; set; }
        public virtual ICollection<CommissionAllocationPolicyEntity> CommissionAllocationPolicies { get; set; }

    }
}