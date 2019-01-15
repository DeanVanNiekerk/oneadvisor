using System;
using System.ComponentModel.DataAnnotations;
using OneAdvisor.Data.Entities.Directory;
using OneAdvisor.Data.Entities.Directory.Lookup;

namespace OneAdvisor.Data.Entities.Member
{
    public class MemberPolicyEntity
    {
        [Key]
        public Guid Id { get; set; }
        [Required]
        public Guid MemberId { get; set; }
        [Required]
        public Guid CompanyId { get; set; }
        [Required]
        public string UserId { get; set; }
        [Required]
        public string Number { get; set; }

        public virtual MemberEntity Member { get; set; }
        public virtual CompanyEntity Company { get; set; }
        public virtual UserEntity User { get; set; }
    }
}