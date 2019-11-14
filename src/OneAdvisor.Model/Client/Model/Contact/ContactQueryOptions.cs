using System;
using OneAdvisor.Model.Common;
using OneAdvisor.Model.Account.Model.Authentication;

namespace OneAdvisor.Model.Client.Model.Contact
{
    public class ContactQueryOptions : QueryOptionsBase<Contact>
    {
        public ContactQueryOptions(ScopeOptions scope, string filters = null)
         : base("Value", "asc", 0, 0, filters)
        {
            Scope = scope;

            var result = GetFilterValue<Guid>("ClientId");
            if (result.Success)
                ClientId = result.Value;
        }

        public ScopeOptions Scope { get; set; }
        public Guid? ClientId { get; set; }
    }
}