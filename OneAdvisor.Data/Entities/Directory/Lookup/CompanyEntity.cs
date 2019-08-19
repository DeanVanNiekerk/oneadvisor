using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using OneAdvisor.Data.Entities.Client;

namespace OneAdvisor.Data.Entities.Directory.Lookup
{
    public class CompanyEntity
    {
        public CompanyEntity()
        {
            CommissionPolicyNumberPrefixes = new List<string>();
        }

        [Key]
        public Guid Id { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        public IEnumerable<string> CommissionPolicyNumberPrefixes { get; set; }

        public virtual ICollection<PolicyEntity> ClientPolicies { get; set; }
    }
}