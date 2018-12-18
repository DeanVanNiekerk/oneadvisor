using System;
using OneAdvisor.Data.Entities.Directory;

namespace OneAdvisor.Data.Entities.Member
{
    public class MemberEntity
    {
        public Guid Id { get; set; }
        public Guid OrganisationId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string MaidenName { get; set; }
        public string Initials { get; set; }
        public string PreferredName { get; set; }
        public string IdNumber { get; set; }
        public DateTime? DateOfBirth { get; set; }

        public virtual OrganisationEntity Organisation { get; set; }
    }
}