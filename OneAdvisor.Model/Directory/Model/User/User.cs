using System;

namespace OneAdvisor.Model.Directory.Model.User
{
    public class User
    {
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
        public bool IsSynced { get; set; }
    }
}