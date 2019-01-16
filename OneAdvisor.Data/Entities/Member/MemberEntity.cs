using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using OneAdvisor.Data.Entities.Directory;

namespace OneAdvisor.Data.Entities.Member
{
    public class MemberEntity
    {
        [Key]
        public Guid Id { get; set; }
        [Required]
        public Guid OrganisationId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string MaidenName { get; set; }
        public string Initials { get; set; }
        public string PreferredName { get; set; }
        public string IdNumber { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public string PassportNumber { get; set; }

        public virtual ICollection<PolicyEntity> MemberPolicies { get; set; }
        public virtual OrganisationEntity Organisation { get; set; }
    }
}