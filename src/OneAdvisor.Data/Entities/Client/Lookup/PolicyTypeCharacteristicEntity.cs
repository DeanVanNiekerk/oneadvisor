using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace OneAdvisor.Data.Entities.Client.Lookup
{
    public class PolicyTypeCharacteristicEntity
    {
        [Key]
        public Guid Id { get; set; }
        [Required]
        public Guid PolicyTypeId { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        public int DisplayOrder { get; set; }

        public virtual PolicyTypeEntity PolicyType { get; set; }
    }
}