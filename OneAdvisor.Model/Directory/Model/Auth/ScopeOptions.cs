using System;

namespace OneAdvisor.Model.Directory.Model.Auth
{
    public class ScopeOptions
    {
        public string UserId { get; set; }
        public Guid? BranchId { get; set; }
        public Guid? OrganisationId { get; set; }
    }
}