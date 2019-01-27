using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using OneAdvisor.Model.Common;
using OneAdvisor.Model.Directory.Model.Auth;
using OneAdvisor.Model.Member.Model.Contact;

namespace OneAdvisor.Model.Member.Interface
{
    public interface IContactService
    {
        Task<PagedItems<Contact>> GetContacts(ContactQueryOptions queryOptions);
        Task<Contact> GetContact(ScopeOptions scope, Guid contactId);
        Task<Contact> GetContact(ScopeOptions scope, Guid memberId, string value);
        Task<Result> UpdateContact(ScopeOptions scope, Contact contact);
        Task<Result> InsertContact(ScopeOptions scope, Contact contact);
    }
}
