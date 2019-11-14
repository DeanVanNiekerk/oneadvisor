using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using OneAdvisor.Data.Entities.Client;
using OneAdvisor.Data.Entities.Commission.Lookup;
using OneAdvisor.Data.Entities.Directory.Lookup;

namespace OneAdvisor.Data.Entities.Client.Lookup
{
    public class PolicyProductEntity
    {
        [Key]
        public Guid Id { get; set; }
        [Required]
        public Guid PolicyProductTypeId { get; set; }
        [Required]
        public Guid CompanyId { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        public string Code { get; set; }

        public virtual PolicyProductTypeEntity PolicyProductType { get; set; }
        public virtual CompanyEntity Company { get; set; }

        public virtual ICollection<PolicyEntity> Policies { get; set; }
    }
}