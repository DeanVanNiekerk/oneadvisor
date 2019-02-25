using System;
using OneAdvisor.Model.Common;
using OneAdvisor.Model.Account.Model.Authentication;

namespace OneAdvisor.Model.Member.Model.Contact
{
    public class ContactQueryOptions : QueryOptionsBase
    {
        public ContactQueryOptions(ScopeOptions scope, string filters = null)
         : base("Value", "asc", 0, 0, filters)
        {
            Scope = scope;

            var result = GetFilterValue<Guid>("MemberId");
            if (result.Success)
                MemberId = result.Value;
        }

        public ScopeOptions Scope { get; set; }
        public Guid? MemberId { get; set; }
    }
}