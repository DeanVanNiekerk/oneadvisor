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
            Config = new OneAdvisor.Model.Directory.Model.User.Configuration.Config();
        }

        public Guid? Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string UserName { get; set; }
        public Guid? BranchId { get; set; }
        public IEnumerable<string> Roles { get; set; }
        public Scope Scope { get; set; }
        public IEnumerable<string> Aliases { get; set; }
        public bool IsLocked { get; set; }
        public Guid? UserTypeId { get; set; }
        public OneAdvisor.Model.Directory.Model.User.Configuration.Config Config { get; set; }

    }
}