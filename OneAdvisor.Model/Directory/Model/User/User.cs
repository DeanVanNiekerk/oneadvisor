using System;
using System.Collections.Generic;

namespace OneAdvisor.Model.Directory.Model.User
{
    public class User
    {
        public User()
        {
            Aliases = new List<string>();
        }

        public string Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Login { get; set; }
        public string Email { get; set; }
        public Guid OrganisationId { get; set; }
        public Guid BranchId { get; set; }
        public Scope Scope { get; set; }
        public IEnumerable<string> Aliases { get; set; }
        public IEnumerable<string> RoleIds { get; set; }
    }
}