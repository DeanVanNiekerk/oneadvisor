using System;
using System.ComponentModel.DataAnnotations;

namespace OneAdvisor.Data.Entities.Directory
{
    public class OrganisationEntity
    {
        [Key]
        public Guid Id { get; set; }
        [Required]
        public string Name { get; set; }
    }
}