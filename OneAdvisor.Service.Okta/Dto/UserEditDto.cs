using System;

namespace OneAdvisor.Service.Okta.Dto
{
    public class UserEditDto
    {
        public UserEditProfileDto profile { get; set; }
    }
    public class UserEditProfileDto
    {
        public string firstName { get; set; }
        public string lastName { get; set; }
        public string login { get; set; }
        public string email { get; set; }
        public Guid organization { get; set; }
    }
}