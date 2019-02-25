using System;
using System.Collections.Generic;

namespace OneAdvisor.Model.Directory.Model.User
{
    public class UserEdit
    {
        public UserEdit()
        {
            Roles = new List<string>();
            Aliases = new List<string>();
        }

        public Guid? Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public Guid? BranchId { get; set; }
        public IEnumerable<string> Roles { get; set; }
        public Scope Scope { get; set; }
        public IEnumerable<string> Aliases { get; set; }
    }
}