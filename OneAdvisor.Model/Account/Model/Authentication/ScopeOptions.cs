using System;
using OneAdvisor.Model.Directory.Model.User;

namespace OneAdvisor.Model.Account.Model.Authentication
{
    public class ScopeOptions
    {
        public ScopeOptions(Guid organisationId, Guid branchId, Guid userId, Scope scope, bool ignoreScope = false)
        {
            UserId = userId;
            BranchId = branchId;
            OrganisationId = organisationId;
            Scope = scope;

            IgnoreScope = ignoreScope;
        }

        public Guid UserId { get; set; }
        public Guid BranchId { get; set; }
        public Guid OrganisationId { get; set; }
        public bool IgnoreScope { get; set; }

        public Scope Scope { get; set; }

        public ScopeOptions Clone(Scope newScope)
        {
            return new ScopeOptions(OrganisationId, BranchId, UserId, newScope, IgnoreScope);
        }
    }
}