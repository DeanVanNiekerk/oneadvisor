using System;

namespace api.Controllers.Member.Member.Dto
{
    public class MemberPreviewDto
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