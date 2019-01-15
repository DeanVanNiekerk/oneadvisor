using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using OneAdvisor.Data.Entities.Member;

namespace OneAdvisor.Data.Entities.Directory
{
    public class UserEntity
    {
        [Key]
        public string Id { get; set; }
        [Required]
        public Guid BranchId { get; set; }
        [Required]
        public string FirstName { get; set; }
        [Required]
        public string LastName { get; set; }

        public virtual BranchEntity Branch { get; set; }
        public virtual ICollection<UserAliasEntity> Aliases { get; set; }
        public virtual ICollection<MemberPolicyEntity> MemberPolicies { get; set; }
    }
}