using System;
using System.ComponentModel.DataAnnotations;

namespace OneAdvisor.Data.Entities.Directory.Lookup
{
    public class LicenseCategoryEntity
    {
        [Key]
        public Guid Id { get; set; }
        [Required]
        public string Code { get; set; }
        [Required]
        public string Name { get; set; }
    }
}