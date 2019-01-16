using System;

namespace api.Controllers.Member.Members.Dto
{
    public class MemberPreviewDto
    {
        public Guid Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string IdNumber { get; set; }
        public DateTime? DateOfBirth { get; set; }

        public int PolicyCount { get; set; }
    }
}