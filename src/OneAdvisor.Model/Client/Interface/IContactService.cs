﻿using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using OneAdvisor.Model.Common;
using OneAdvisor.Model.Account.Model.Authentication;
using OneAdvisor.Model.Client.Model.Contact;

namespace OneAdvisor.Model.Client.Interface
{
    public interface IContactService
    {
        Task<PagedItems<Contact>> GetContacts(ContactQueryOptions queryOptions);
        Task<Contact> GetContact(ScopeOptions scope, Guid contactId);
        Task<Contact> GetContact(ScopeOptions scope, Guid clientId, string value);
        Task<Result> UpdateContact(ScopeOptions scope, Contact contact);
        Task<Result> DeleteContact(ScopeOptions scope, Guid contactId);
        Task<Result> InsertContact(ScopeOptions scope, Contact contact);
    }
}
