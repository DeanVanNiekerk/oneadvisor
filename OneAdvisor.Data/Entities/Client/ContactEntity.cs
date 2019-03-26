using System;
using System.ComponentModel.DataAnnotations;
using OneAdvisor.Data.Entities.Directory;
using OneAdvisor.Data.Entities.Directory.Lookup;

namespace OneAdvisor.Data.Entities.Client
{
    public class ContactEntity
    {
        [Key]
        public Guid Id { get; set; }
        [Required]
        public Guid ClientId { get; set; }
        [Required]
        public Guid ContactTypeId { get; set; }
        [Required]
        public string Value { get; set; }

        public virtual ClientEntity Client { get; set; }
        public virtual ContactTypeEntity ContactType { get; set; }
    }
}