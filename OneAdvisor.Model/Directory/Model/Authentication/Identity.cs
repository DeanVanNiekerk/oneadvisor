using System;
using System.Collections.Generic;
using OneAdvisor.Model.Directory.Model.User;

namespace OneAdvisor.Model.Directory.Model.Authentication
{
    public class Identity
    {
        public Guid UserId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public Guid OrganisationId { get; set; }
        public string OrganisationName { get; set; }
        public Guid BranchId { get; set; }
        public string BranchName { get; set; }
        public IEnumerable<string> Roles { get; set; }
        public IEnumerable<string> UseCaseIds { get; set; }
        public Scope Scope { get; set; }
    }
}