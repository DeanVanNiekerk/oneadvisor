using System;

namespace OneAdvisor.Model.Account.Model.Authentication
{
    public class ScopeInfo
    {
        public Guid UserId { get; set; }
        public Guid BranchId { get; set; }
        public Guid OrganisationId { get; set; }
    }
}