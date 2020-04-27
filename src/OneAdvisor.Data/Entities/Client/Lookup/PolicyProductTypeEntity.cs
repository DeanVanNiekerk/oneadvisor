using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using OneAdvisor.Model.Client.Model.Lookup;

namespace OneAdvisor.Data.Entities.Client.Lookup
{
    public class PolicyProductTypeEntity
    {
        public PolicyProductTypeEntity()
        {
            PolicyTypeCharacteristics = new List<PolicyTypeCharacteristicDescription>();
        }

        [Key]
        public Guid Id { get; set; }
        [Required]
        public Guid PolicyTypeId { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        public string Code { get; set; }
        [Required]
        public IEnumerable<PolicyTypeCharacteristicDescription> PolicyTypeCharacteristics { get; set; }

        public virtual PolicyTypeEntity PolicyType { get; set; }

        public virtual ICollection<PolicyEntity> Policies { get; set; }
    }
}