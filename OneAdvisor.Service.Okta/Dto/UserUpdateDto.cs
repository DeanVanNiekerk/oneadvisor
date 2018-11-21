using System;

namespace OneAdvisor.Service.Okta.Dto
{
    public class UserUpdateDto
    {
        public ProfileUpdateDto profile { get; set; }
    }
    public class ProfileUpdateDto
    {
        public string firstName { get; set; }
        public string lastName { get; set; }
        public string login { get; set; }
        public string email { get; set; }
        public Guid organization { get; set; }
    }
}