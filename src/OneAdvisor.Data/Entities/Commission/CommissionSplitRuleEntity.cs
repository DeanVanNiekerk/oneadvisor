using System;
using System.ComponentModel.DataAnnotations;
using OneAdvisor.Data.Entities.Directory;
using System.Collections.Generic;
using OneAdvisor.Model.Commission.Model.CommissionSplitRule;

namespace OneAdvisor.Data.Entities.Commission
{
    public class CommissionSplitRuleEntity
    {
        public CommissionSplitRuleEntity()
        {
            Split = new List<CommissionSplit>();
        }

        [Key]
        public Guid Id { get; set; }
        [Required]
        public Guid UserId { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        public bool IsDefault { get; set; }

        [Required]
        public List<CommissionSplit> Split { get; set; }

        public virtual UserEntity User { get; set; }
        public virtual ICollection<CommissionSplitRulePolicyEntity> CommissionSplitRulePolicy { get; set; }
    }
}