using System;
using System.Collections.Generic;
using OneAdvisor.Model.Directory.Model.User;

namespace api.Controllers.Directory.Users.Dto
{
    public class UserEditDto
    {
        public Guid Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public Guid? BranchId { get; set; }
        public IEnumerable<string> Roles { get; set; }
        public Scope Scope { get; set; }
        public IEnumerable<string> Aliases { get; set; }
    }
}