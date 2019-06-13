using System;
using System.ComponentModel.DataAnnotations;
using OneAdvisor.Data.Entities.Client;
using OneAdvisor.Data.Entities.Client.Lookup;
using OneAdvisor.Data.Entities.Commission;
using OneAdvisor.Data.Entities.Directory;
using OneAdvisor.Data.Entities.Directory.Lookup;

namespace OneAdvisor.Data.Entities.Commission
{
    public class CommissionSplitRulePolicyEntity
    {
        [Key]
        public Guid Id { get; set; }
        [Required]
        public Guid CommissionSplitRuleId { get; set; }
        [Required]
        public Guid PolicyId { get; set; }

        public virtual PolicyEntity Policy { get; set; }
        public virtual CommissionSplitRuleEntity CommissionSplitRule { get; set; }
    }
}