using System;
using OneAdvisor.Model.Common;
using OneAdvisor.Model.Directory.Model.Auth;

namespace OneAdvisor.Model.Member.Model.Contact
{
    public class ContactQueryOptions : QueryOptionsBase
    {
        public ContactQueryOptions(ScopeOptions scope, string filters = null)
         : base("Value", "desc", 0, 0, filters)
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