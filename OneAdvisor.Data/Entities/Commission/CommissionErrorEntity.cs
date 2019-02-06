using System;
using System.ComponentModel.DataAnnotations;
using OneAdvisor.Data.Entities.Directory.Lookup;
using OneAdvisor.Data.Entities.Member;

namespace OneAdvisor.Data.Entities.Commission
{
    public class CommissionErrorEntity
    {
        [Key]
        public Guid Id { get; set; }
        [Required]
        public Guid CommissionStatementId { get; set; }
        public string PolicyNumber { get; set; }
        public string CommissionTypeCode { get; set; }

        public Guid? PolicyId { get; set; }
        public Guid? MemberId { get; set; }
        public Guid? CommissionTypeId { get; set; }
        [Required]
        public string Data { get; set; }
        public bool IsFormatValue { get; set; }

        public virtual CommissionStatementEntity CommissionStatement { get; set; }
        public virtual PolicyEntity Policy { get; set; }
        public virtual MemberEntity Member { get; set; }

    }
}