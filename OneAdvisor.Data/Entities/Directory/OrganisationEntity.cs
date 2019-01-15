using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using OneAdvisor.Data.Entities.Member;

namespace OneAdvisor.Data.Entities.Directory
{
    public class OrganisationEntity
    {
        [Key]
        public Guid Id { get; set; }
        [Required]
        public string Name { get; set; }

        public virtual ICollection<BranchEntity> Branches { get; set; }
        public virtual ICollection<MemberEntity> Members { get; set; }
    }
}