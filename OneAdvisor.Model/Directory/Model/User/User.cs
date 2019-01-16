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
        public DateTime? LastLogin { get; set; }
        public DateTime? LastUpdated { get; set; }
        public DateTime? Activated { get; set; }
        public string Status { get; set; }
        public Guid OrganisationId { get; set; }
        public Guid BranchId { get; set; }
        public Scope Scope { get; set; }
        public IEnumerable<string> Aliases { get; set; }
        public string AssistantToUserId { get; set; }
    }
}