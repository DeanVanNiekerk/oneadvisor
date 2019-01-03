using System;

namespace OneAdvisor.Model.Directory.Model.Auth
{
    public class ScopeOptions
    {
        public ScopeOptions()
            : this(null)
        { }

        public ScopeOptions(string userId)
        {
            UserId = userId;
        }

        public string UserId { get; set; }
        public Guid? BranchId { get; set; }
        public Guid? OrganisationId { get; set; }
    }
}