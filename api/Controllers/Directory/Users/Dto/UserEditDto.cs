using System;
using System.Collections.Generic;
using OneAdvisor.Model.Directory.Model.User;

namespace api.Controllers.Directory.Users.Dto
{
    public class UserEditDto
    {
        public string Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Login { get; set; }
        public string Email { get; set; }
        public Guid? BranchId { get; set; }
        public IEnumerable<string> RoleIds { get; set; }
        public Scope Scope { get; set; }
        public IEnumerable<string> Aliases { get; set; }
        public string AssistantToUserId { get; set; }
    }
}