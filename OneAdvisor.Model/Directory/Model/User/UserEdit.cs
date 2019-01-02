using System;
using System.Collections.Generic;

namespace OneAdvisor.Model.Directory.Model.User
{
    public class UserEdit
    {
        public string Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Login { get; set; }
        public string Email { get; set; }
        public Guid? BranchId { get; set; }
        public IEnumerable<string> RoleIds { get; set; }
        public Scope Scope { get; set; }
        public string AssistantToUserId { get; set; }
    }
}