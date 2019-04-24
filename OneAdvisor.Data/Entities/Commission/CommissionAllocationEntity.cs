using System;
using System.ComponentModel.DataAnnotations;
using OneAdvisor.Data.Entities.Directory.Lookup;
using OneAdvisor.Data.Entities.Client;
using OneAdvisor.Model.Commission.Model.ImportCommission;
using OneAdvisor.Data.Entities.Commission.Lookup;
using System.Collections.Generic;

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
        [Required]
        public List<Guid> PolicyIds { get; set; }

        public virtual ClientEntity FromClient { get; set; }
        public virtual ClientEntity ToClient { get; set; }
    }
}