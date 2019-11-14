using System;
using System.Collections.Generic;

namespace OneAdvisor.Model.Directory.Model.User
{
    public class User
    {
        public Guid Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string UserName { get; set; }
        public Guid OrganisationId { get; set; }
        public string OrganisationName { get; set; }
        public Guid BranchId { get; set; }
        public string BranchName { get; set; }
        public Scope Scope { get; set; }
        public bool EmailConfirmed { get; set; }
        public DateTimeOffset? LockoutEnd { get; set; }
        public Guid UserTypeId { get; set; }
        public bool IsLocked
        {
            get
            {
                return LockoutEnd.HasValue && LockoutEnd.Value.LocalDateTime > DateTime.Now;
            }
        }
    }
}