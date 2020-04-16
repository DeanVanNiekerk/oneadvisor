using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json;
using OneAdvisor.Data.Entities.Client.Lookup;
using OneAdvisor.Data.Entities.Commission;
using OneAdvisor.Data.Entities.Directory;
using OneAdvisor.Data.Entities.Directory.Lookup;

namespace OneAdvisor.Data.Entities.Client
{
    public class PolicyEntity
    {
        [Key]
        public Guid Id { get; set; }
        [Required]
        public Guid ClientId { get; set; }
        [Required]
        public Guid CompanyId { get; set; }
        [Required]
        public Guid UserId { get; set; }
        [Required]
        public string Number { get; set; }
        [Required]
        public string _NumberAliases { get; set; }
        [NotMapped]
        public IEnumerable<string> NumberAliases
        {
            get
            {
                return _NumberAliases == null ? null : JsonSerializer.Deserialize<string[]>(_NumberAliases);
            }
            set
            {
                _NumberAliases = JsonSerializer.Serialize(value);
            }
        }
        public DateTime? StartDate { get; set; }
        public decimal? Premium { get; set; }
        public Guid? PolicyTypeId { get; set; }
        public Guid? PolicyProductTypeId { get; set; }
        public Guid? PolicyProductId { get; set; }
        public bool IsActive { get; set; }

        public virtual ClientEntity Client { get; set; }
        public virtual CompanyEntity Company { get; set; }
        public virtual UserEntity User { get; set; }
        public virtual PolicyTypeEntity PolicyType { get; set; }
        public virtual PolicyProductTypeEntity PolicyProductType { get; set; }
        public virtual PolicyProductEntity PolicyProduct { get; set; }

        //NB!!!!: When adding new list relationships dont forget to update MergePolicies() ----
        public virtual ICollection<CommissionEntity> Commissions { get; set; }
        public virtual ICollection<CommissionErrorEntity> CommissionErrors { get; set; }
        public virtual ICollection<CommissionSplitRulePolicyEntity> CommissionSplitRulePolicies { get; set; }
        public virtual ICollection<CommissionAllocationPolicyEntity> CommissionAllocationPolicies { get; set; }
        //-------------------------------------------------------------------------------------
    }
}