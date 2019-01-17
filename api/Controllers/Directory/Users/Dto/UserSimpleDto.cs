using System;

namespace api.Controllers.Directory.Users.Dto
{
    public class UserSimpleDto
    {
        public string Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }

        public string FullName
        {
            get
            {
                return $"{FirstName} {LastName}";
            }
        }
    }
}