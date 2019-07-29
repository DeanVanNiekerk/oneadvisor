using System;
using System.ComponentModel.DataAnnotations;
using OneAdvisor.Data.Entities.Directory.Lookup;
using OneAdvisor.Data.Entities.Client;
using OneAdvisor.Model.Commission.Model.ImportCommission;

namespace OneAdvisor.Data.Entities.Commission
{
    public class CommissionErrorEntity
    {
        [Key]
        public Guid Id { get; set; }
        [Required]
        public Guid CommissionStatementId { get; set; }

        public Guid? PolicyId { get; set; }
        public Guid? ClientId { get; set; }
        public Guid? CommissionTypeId { get; set; }
        [Required]
        public ImportCommission Data { get; set; }

        public virtual CommissionStatementEntity CommissionStatement { get; set; }
        public virtual PolicyEntity Policy { get; set; }
        public virtual ClientEntity Client { get; set; }

    }
}