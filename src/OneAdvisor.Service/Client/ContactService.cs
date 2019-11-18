using System;
using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;
using OneAdvisor.Data;
using OneAdvisor.Model.Common;
using Microsoft.EntityFrameworkCore;
using OneAdvisor.Model;
using OneAdvisor.Service.Common.Query;
using OneAdvisor.Model.Client.Interface;
using OneAdvisor.Model.Client.Model.Contact;
using OneAdvisor.Service.Client.Validators;
using OneAdvisor.Model.Account.Model.Authentication;
using OneAdvisor.Data.Entities.Client;
using OneAdvisor.Model.Directory.Interface;
using OneAdvisor.Model.Directory.Model.Audit;

namespace OneAdvisor.Service.Client
{
    public class ContactService : IContactService
    {
        private readonly DataContext _context;
        private readonly IAuditService _auditService;

        public ContactService(DataContext context, IAuditService auditService)
        {
            _context = context;
            _auditService = auditService;
        }

        public async Task<PagedItems<Contact>> GetContacts(ContactQueryOptions queryOptions)
        {
            var query = GetContactQuery(queryOptions.Scope);

            //Apply filters ----------------------------------------------------------------------------------------
            if (queryOptions.ClientId.HasValue)
                query = query.Where(b => b.ClientId == queryOptions.ClientId);
            //------------------------------------------------------------------------------------------------------

            var pagedItems = new PagedItems<Contact>();

            //Get total items
            pagedItems.TotalItems = await query.CountAsync();

            //Ordering
            query = query.OrderBy(queryOptions.SortOptions.Column, queryOptions.SortOptions.Direction);

            //Paging
            pagedItems.Items = await query.TakePage(queryOptions.PageOptions.Number, queryOptions.PageOptions.Size).ToListAsync();

            return pagedItems;
        }

        public async Task<Contact> GetContact(ScopeOptions scope, Guid id)
        {
            var query = from contact in GetContactQuery(scope)
                        where contact.Id == id
                        select contact;
            return await query.FirstOrDefaultAsync();
        }

        public async Task<Contact> GetContact(ScopeOptions scope, Guid clientId, string value)
        {
            var query = from contact in GetContactQuery(scope)
                        join client in _context.Client
                            on contact.ClientId equals client.Id
                        where client.Id == clientId
                        && EF.Functions.Like(contact.Value, $"{value}")
                        select contact;
            return await query.FirstOrDefaultAsync();
        }

        public async Task<Result> InsertContact(ScopeOptions scope, Contact contact)
        {
            var validator = new ContactValidator(_context, scope, true);
            var result = validator.Validate(contact).GetResult();

            if (!result.Success)
                return result;

            var entity = MapModelToEntity(contact);
            await _context.Contact.AddAsync(entity);
            await _context.SaveChangesAsync();

            contact.Id = entity.Id;
            result.Tag = contact;

            await _auditService.InsertAuditLog(scope, AuditLog.ACTION_INSERT, "Contact", entity.Id, contact);

            return result;
        }

        public async Task<Result> UpdateContact(ScopeOptions scope, Contact contact)
        {
            var validator = new ContactValidator(_context, scope, false);
            var result = validator.Validate(contact).GetResult();

            if (!result.Success)
                return result;

            var entity = await GetContactEntityQuery(scope).FirstOrDefaultAsync(b => b.Id == contact.Id);

            if (entity == null)
                return new Result();

            entity = MapModelToEntity(contact, entity);
            await _context.SaveChangesAsync();

            await _auditService.InsertAuditLog(scope, AuditLog.ACTION_UPDATE, "Contact", entity.Id, contact);

            return result;
        }

        public async Task<Result> DeleteContact(ScopeOptions scope, Guid contactId)
        {
            var entity = await GetContactEntityQuery(scope).FirstOrDefaultAsync(b => b.Id == contactId);

            if (entity == null)
                return new Result();

            _context.Contact.Remove(entity);

            await _context.SaveChangesAsync();

            await _auditService.InsertAuditLog(scope, AuditLog.ACTION_DELETE, "Contact", entity.Id, entity);

            return new Result(true);
        }

        private IQueryable<ContactEntity> GetContactEntityQuery(ScopeOptions scope)
        {
            var query = from client in ScopeQuery.GetClientEntityQuery(_context, scope)
                        join contact in _context.Contact
                            on client.Id equals contact.ClientId
                        select contact;

            return query;
        }

        private IQueryable<Contact> GetContactQuery(ScopeOptions scope)
        {
            var query = from contact in GetContactEntityQuery(scope)
                        select new Contact()
                        {
                            Id = contact.Id,
                            ClientId = contact.ClientId,
                            ContactTypeId = contact.ContactTypeId,
                            Value = contact.Value
                        };

            return query;
        }

        private ContactEntity MapModelToEntity(Contact model, ContactEntity entity = null)
        {
            if (entity == null)
                entity = new ContactEntity();

            entity.ContactTypeId = model.ContactTypeId.Value;
            entity.ClientId = model.ClientId.Value;
            entity.Value = model.Value;

            return entity;
        }
    }
}