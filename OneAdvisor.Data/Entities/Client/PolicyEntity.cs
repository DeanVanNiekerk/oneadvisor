using System;
using System.ComponentModel.DataAnnotations;
using OneAdvisor.Data.Entities.Client.Lookup;
using OneAdvisor.Data.Entities.Directory;
using OneAdvisor.Data.Entities.Directory.Lookup;

namespace OneAdvisor.Data.Entities.Client
{
    public class PolicyEntity
    {
        [Key]
        public Guid Id { get; set; }
        [Required]
        public Guid ClientId { get; set; }
        [Required]
        public Guid CompanyId { get; set; }
        [Required]
        public Guid UserId { get; set; }
        [Required]
        public string Number { get; set; }
        public DateTime? StartDate { get; set; }
        public decimal? Premium { get; set; }
        public Guid? PolicyTypeId { get; set; }

        public virtual ClientEntity Client { get; set; }
        public virtual CompanyEntity Company { get; set; }
        public virtual UserEntity User { get; set; }
        public virtual PolicyTypeEntity PolicyType { get; set; }
    }
}