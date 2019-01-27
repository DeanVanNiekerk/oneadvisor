using System;
using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;
using OneAdvisor.Data;
using OneAdvisor.Model.Common;
using Microsoft.EntityFrameworkCore;
using OneAdvisor.Model;
using OneAdvisor.Service.Common.Query;
using OneAdvisor.Model.Member.Interface;
using OneAdvisor.Model.Member.Model.Contact;
using OneAdvisor.Service.Member.Validators;
using OneAdvisor.Model.Directory.Model.Auth;
using OneAdvisor.Data.Entities.Member;

namespace OneAdvisor.Service.Member
{
    public class ContactService : IContactService
    {
        private readonly DataContext _context;

        public ContactService(DataContext context)
        {
            _context = context;
        }

        public async Task<PagedItems<Contact>> GetContacts(ContactQueryOptions queryOptions)
        {
            var query = GetContactQuery(queryOptions.Scope);

            //Apply filters ----------------------------------------------------------------------------------------
            if (queryOptions.MemberId.HasValue)
                query = query.Where(b => b.MemberId == queryOptions.MemberId);
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

        public async Task<Contact> GetContact(ScopeOptions scope, Guid memberId, string value)
        {
            var query = from contact in GetContactQuery(scope)
                        join member in _context.Member
                            on contact.MemberId equals member.Id
                        where member.Id == memberId
                        && EF.Functions.Like(contact.Value, $"{value}")
                        select contact;
            return await query.FirstOrDefaultAsync();
        }

        public async Task<Result> InsertContact(ScopeOptions scope, Contact contact)
        {
            var validator = new ContactValidator(true);
            var result = validator.Validate(contact).GetResult();

            if (!result.Success)
                return result;

            result = await ScopeQuery.IsMemberInOrganisation(_context, scope, contact.MemberId);

            if (!result.Success)
                return result;

            var entity = MapModelToEntity(contact);
            await _context.Contact.AddAsync(entity);
            await _context.SaveChangesAsync();

            contact.Id = entity.Id;
            result.Tag = contact;

            return result;
        }

        public async Task<Result> UpdateContact(ScopeOptions scope, Contact contact)
        {
            var validator = new ContactValidator(false);
            var result = validator.Validate(contact).GetResult();

            if (!result.Success)
                return result;

            var entity = await GetContactEntityQuery(scope).FirstOrDefaultAsync(b => b.Id == contact.Id);

            if (entity == null)
                return new Result();

            entity = MapModelToEntity(contact, entity);
            await _context.SaveChangesAsync();

            return result;
        }

        private IQueryable<ContactEntity> GetContactEntityQuery(ScopeOptions scope)
        {
            var query = from member in ScopeQuery.GetMemberEntityQuery(_context, scope)
                        join contact in _context.Contact
                            on member.Id equals contact.MemberId
                        select contact;

            return query;
        }

        private IQueryable<Contact> GetContactQuery(ScopeOptions scope)
        {
            var query = from contact in GetContactEntityQuery(scope)
                        select new Contact()
                        {
                            Id = contact.Id,
                            MemberId = contact.MemberId,
                            ContactTypeId = contact.ContactTypeId,
                            Value = contact.Value
                        };

            return query;
        }

        private ContactEntity MapModelToEntity(Contact model, ContactEntity entity = null)
        {
            if (entity == null)
                entity = new ContactEntity();

            entity.ContactTypeId = model.ContactTypeId;
            entity.MemberId = model.MemberId;
            entity.Value = model.Value;

            return entity;
        }
    }
}