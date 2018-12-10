using System;
using System.Collections.Generic;

namespace api.Controllers.Directory.Users.Dto
{
    public class UserEditDto
    {
        public string Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Login { get; set; }
        public string Email { get; set; }
        public Guid OrganisationId { get; set; }
        public IEnumerable<string> RoleIds {get; set; }
    }
}