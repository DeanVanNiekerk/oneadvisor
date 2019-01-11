using System;

namespace OneAdvisor.Model.Member.Model.Member
{
    public class MemberPreview
    {
        public Guid Id { get; set; }
        public string UserId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string IdNumber { get; set; }
        public DateTime? DateOfBirth { get; set; }

        public string UserFirstName { get; set; }
        public string UserLastName { get; set; }

        public int PolicyCount { get; set; }
    }
}