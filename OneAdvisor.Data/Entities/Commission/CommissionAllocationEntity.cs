using System;
using System.ComponentModel.DataAnnotations;
using OneAdvisor.Data.Entities.Directory.Lookup;
using OneAdvisor.Data.Entities.Client;
using OneAdvisor.Model.Commission.Model.ImportCommission;
using OneAdvisor.Data.Entities.Commission.Lookup;

namespace OneAdvisor.Data.Entities.Commission
{
    public class CommissionAllocationEntity
    {
        [Key]
        public Guid Id { get; set; }
        [Required]
        public Guid FromClientId { get; set; }
        [Required]
        public Guid ToClientId { get; set; }

        public virtual ClientEntity FromClient { get; set; }
        public virtual ClientEntity ToClient { get; set; }
    }
}