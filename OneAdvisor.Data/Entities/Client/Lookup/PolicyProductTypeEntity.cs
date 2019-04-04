using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using OneAdvisor.Data.Entities.Client;

namespace OneAdvisor.Data.Entities.Client.Lookup
{
    public class PolicyProductTypeEntity
    {
        [Key]
        public Guid Id { get; set; }
        [Required]
        public Guid PolicyTypeId { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        public string Code { get; set; }

        public virtual PolicyTypeEntity PolicyType { get; set; }

        public virtual ICollection<PolicyEntity> Policies { get; set; }
    }
}