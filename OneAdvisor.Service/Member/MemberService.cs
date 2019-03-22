using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using OneAdvisor.Data;
using OneAdvisor.Data.Entities.Member;
using OneAdvisor.Model;
using OneAdvisor.Model.Common;
using OneAdvisor.Model.Account.Model.Authentication;
using OneAdvisor.Model.Member.Interface;
using OneAdvisor.Model.Member.Model.Member;
using OneAdvisor.Service.Common.Query;
using OneAdvisor.Service.Member.Validators;
using FluentValidation;
using OneAdvisor.Model.Member.Model.Merge;

namespace OneAdvisor.Service.Member
{
    public class MemberService : IMemberService
    {
        private readonly DataContext _context;

        public MemberService(DataContext context)
        {
            _context = context;
        }

        public async Task<PagedItems<Model.Member.Model.Member.Member>> GetMembers(MemberQueryOptions queryOptions)
        {
            var query = from member in GetMemberEntityQuery(queryOptions.Scope)
                        select new Model.Member.Model.Member.Member()
                        {
                            Id = member.Id,
                            FirstName = member.FirstName,
                            LastName = member.LastName,
                            MaidenName = member.MaidenName,
                            IdNumber = member.IdNumber,
                            PassportNumber = member.PassportNumber,
                            Initials = member.Initials,
                            PreferredName = member.PreferredName,
                            DateOfBirth = member.DateOfBirth,
                            TaxNumber = member.TaxNumber,
                            MarritalStatusId = member.MarritalStatusId,
                            MarriageDate = member.MarriageDate
                        };

            //Apply filters ----------------------------------------------------------------------------------------
            if (!string.IsNullOrWhiteSpace(queryOptions.FirstName))
                query = query.Where(m => EF.Functions.Like(m.FirstName, queryOptions.FirstName));

            if (!string.IsNullOrWhiteSpace(queryOptions.LastName))
                query = query.Where(m => EF.Functions.Like(m.LastName, queryOptions.LastName));

            if (!string.IsNullOrWhiteSpace(queryOptions.IdNumber))
                query = query.Where(m => EF.Functions.Like(m.IdNumber, queryOptions.IdNumber));

            if (queryOptions.MemberId.Any())
                query = query.Where(m => queryOptions.MemberId.Contains(m.Id));
            //------------------------------------------------------------------------------------------------------

            var pagedItems = new PagedItems<Model.Member.Model.Member.Member>();

            //Get total items
            pagedItems.TotalItems = await query.CountAsync();

            //Ordering
            query = query.OrderBy(queryOptions.SortOptions.Column, queryOptions.SortOptions.Direction);

            //Paging
            pagedItems.Items = await query.TakePage(queryOptions.PageOptions.Number, queryOptions.PageOptions.Size).ToListAsync();

            return pagedItems;
        }

        public Task<MemberPreview> GetMemberPreview(ScopeOptions scope, Guid id)
        {
            var query = from member in GetMemberEntityQuery(scope)
                        where member.Id == id
                        select new MemberPreview()
                        {
                            Id = member.Id,
                            FirstName = member.FirstName,
                            LastName = member.LastName,
                            IdNumber = member.IdNumber,
                            DateOfBirth = member.DateOfBirth,
                            PolicyCount = member.MemberPolicies.Count(),
                            ContactCount = member.MemberContacts.Count()
                        };

            return query.FirstOrDefaultAsync();
        }

        public Task<MemberEdit> GetMember(ScopeOptions scope, Guid id)
        {
            var query = from member in GetMemberEntityQuery(scope)
                        where member.Id == id
                        select new MemberEdit()
                        {
                            Id = member.Id,
                            FirstName = member.FirstName,
                            LastName = member.LastName,
                            MaidenName = member.MaidenName,
                            IdNumber = member.IdNumber,
                            PassportNumber = member.PassportNumber,
                            Initials = member.Initials,
                            PreferredName = member.PreferredName,
                            DateOfBirth = member.DateOfBirth,
                            TaxNumber = member.TaxNumber,
                            MarritalStatusId = member.MarritalStatusId,
                            MarriageDate = member.MarriageDate
                        };

            return query.FirstOrDefaultAsync();
        }

        public async Task<Result> InsertMember(ScopeOptions scope, MemberEdit member)
        {
            var validator = new MemberValidator(_context, scope, true);
            var result = validator.Validate(member, ruleSet: "default,Availability").GetResult();

            if (!result.Success)
                return result;

            var entity = MapModelToEntity(member);
            entity.OrganisationId = scope.OrganisationId;
            await _context.Member.AddAsync(entity);
            await _context.SaveChangesAsync();

            member.Id = entity.Id;
            result.Tag = member;

            return result;
        }

        public async Task<Result> UpdateMember(ScopeOptions scope, MemberEdit member)
        {
            var validator = new MemberValidator(_context, scope, false);
            var result = validator.Validate(member, ruleSet: "default,Availability").GetResult();

            if (!result.Success)
                return result;

            var entity = await GetMemberEntityQuery(scope).FirstOrDefaultAsync(m => m.Id == member.Id);

            if (entity == null)
                return new Result();

            var memberEntity = MapModelToEntity(member, entity);

            await _context.SaveChangesAsync();

            return result;
        }

        public async Task<Result> DeleteMember(ScopeOptions scope, Guid memberId)
        {
            var entity = await GetMemberEntityQuery(scope).FirstOrDefaultAsync(m => m.Id == memberId);

            if (entity == null)
                return new Result();

            entity.IsDeleted = true;

            await _context.SaveChangesAsync();

            return new Result(true);
        }

        public async Task<Result> MergeMembers(ScopeOptions scope, MergeMembers merge)
        {
            var memberValidator = new MemberValidator(_context, scope, true);
            var result = memberValidator.Validate(merge.TargetMember, ruleSet: "default").GetResult();

            if (!result.Success)
                return result;

            var mergeValidator = new MergeMembersValidator(_context);
            result = mergeValidator.Validate(merge).GetResult();

            if (!result.Success)
                return result;

            //Scope check ------
            var options = new MemberQueryOptions(scope, "", "", 0, 0);
            options.MemberId = merge.SourceMemberIds;

            var members = await GetMembers(options);

            if (members.TotalItems != merge.SourceMemberIds.Count)
                return new Result("SourceMemberIds", "Invalid Source Member Ids");
            //--------------------

            //Insert the 'new' member
            var entity = MapModelToEntity(merge.TargetMember);
            entity.OrganisationId = scope.OrganisationId;
            await _context.Member.AddAsync(entity);
            await _context.SaveChangesAsync();

            merge.TargetMember.Id = entity.Id;

            //Move dependancies to the new member -----------------------------------------------------

            //1. Policies
            var policies = await _context.Policy.Where(p => merge.SourceMemberIds.Contains(p.MemberId)).ToListAsync();
            foreach (var policy in policies)
                policy.MemberId = merge.TargetMember.Id.Value;

            //2. Contacts
            var contacts = await _context.Contact.Where(c => merge.SourceMemberIds.Contains(c.MemberId)).ToListAsync();
            foreach (var contact in contacts)
                contact.MemberId = merge.TargetMember.Id.Value;

            //----------------------------------------------------------------------------------------

            //Delete 'old' members
            var memberToDelete = await _context.Member.Where(m => merge.SourceMemberIds.Contains(m.Id)).ToListAsync();
            foreach (var member in memberToDelete)
                member.IsDeleted = true;

            await _context.SaveChangesAsync();

            result.Tag = merge.TargetMember;

            return result;
        }

        private IQueryable<MemberEntity> GetMemberEntityQuery(ScopeOptions scope)
        {
            return ScopeQuery.GetMemberEntityQuery(_context, scope);
        }

        private MemberEntity MapModelToEntity(MemberEdit model, MemberEntity entity = null)
        {
            if (entity == null)
                entity = new MemberEntity();

            entity.FirstName = model.FirstName;
            entity.LastName = model.LastName;
            entity.MaidenName = model.MaidenName;
            entity.IdNumber = model.IdNumber;
            entity.PassportNumber = model.PassportNumber;
            entity.Initials = model.Initials;
            entity.PreferredName = model.PreferredName;
            entity.DateOfBirth = model.DateOfBirth;
            entity.TaxNumber = model.TaxNumber;
            entity.MarritalStatusId = model.MarritalStatusId;
            entity.MarriageDate = model.MarriageDate;

            if (entity.DateOfBirth == null)
            {
                var id = new IdNumber(model.IdNumber);
                if (id.IsValid)
                    entity.DateOfBirth = id.DateOfBirth;
            }

            return entity;
        }
    }
}