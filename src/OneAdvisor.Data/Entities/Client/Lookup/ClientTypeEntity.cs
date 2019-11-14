using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using OneAdvisor.Data.Entities.Client;

namespace OneAdvisor.Data.Entities.Client.Lookup
{
    public class ClientTypeEntity
    {
        [Key]
        public Guid Id { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        public string Code { get; set; }
        [Required]
        public int DisplayOrder { get; set; }
    }
}