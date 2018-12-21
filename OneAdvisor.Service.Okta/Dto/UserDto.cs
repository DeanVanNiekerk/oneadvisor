using System;

namespace OneAdvisor.Service.Okta.Dto
{
    public class UserDto
    {
        public string id { get; set; }
        public string status { get; set; }
        public string created { get; set; }
        public string activated { get; set; }
        public string statusChanged { get; set; }
        public string lastLogin { get; set; }
        public string lastUpdated { get; set; }
        public string passwordChanged { get; set; }
        public UserProfileDto profile { get; set; }

    }

    public class UserProfileDto
    {
        public string firstName { get; set; }
        public string lastName { get; set; }
        public string mobilePhone { get; set; }
        public string branchId { get; set; }
        public string secondEmail { get; set; }
        public string login { get; set; }
        public string email { get; set; }
    }
}
