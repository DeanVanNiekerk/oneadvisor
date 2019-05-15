using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using OneAdvisor.Data.Entities.Client;
using OneAdvisor.Data.Entities.Commission.Lookup;

namespace OneAdvisor.Data.Entities.Client.Lookup
{
    public class PolicyTypeEntity
    {
        [Key]
        public Guid Id { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        public string Code { get; set; }
        [Required]
        public int DisplayOrder { get; set; }


        public virtual ICollection<PolicyEntity> Policies { get; set; }
        public virtual ICollection<CommissionTypeEntity> CommissionTypes { get; set; }
        public virtual ICollection<PolicyProductTypeEntity> PolicyProductTypes { get; set; }
    }
}