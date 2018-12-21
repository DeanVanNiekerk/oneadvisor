using System;

namespace OneAdvisor.Model.Member.Model.Member
{
    public class Member
    {
        public Guid Id { get; set; }
        public string UserId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string MaidenName { get; set; }
        public string Initials { get; set; }
        public string PreferredName { get; set; }
        public string IdNumber { get; set; }
        public DateTime? DateOfBirth { get; set; }

        public string UserFirstName { get; set; }
        public string UserLastName { get; set; }
        public Guid OrganisationId { get; set; }
        public Guid BranchId { get; set; }
    }
}