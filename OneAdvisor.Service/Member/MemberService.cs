using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using OneAdvisor.Data;
using OneAdvisor.Data.Entities.Member;
using OneAdvisor.Model;
using OneAdvisor.Model.Common;
using OneAdvisor.Model.Directory.Model.Auth;
using OneAdvisor.Model.Exceptions;
using OneAdvisor.Model.Member.Interface;
using OneAdvisor.Model.Member.Model.Member;
using OneAdvisor.Service.Common.Query;
using OneAdvisor.Service.Member.Validators;

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
            var userQuery = ScopeQuery.GetUserEntityQuery(_context, queryOptions.Scope);

            var query = from member in _context.Member
                        join user in userQuery
                            on member.UserId equals user.Id
                        join branch in _context.Branch
                            on user.BranchId equals branch.Id
                        select new Model.Member.Model.Member.Member()
                        {
                            Id = member.Id,
                            UserId = member.UserId,
                            FirstName = member.FirstName,
                            LastName = member.LastName,
                            MaidenName = member.MaidenName,
                            IdNumber = member.IdNumber,
                            Initials = member.Initials,
                            PreferredName = member.PreferredName,
                            DateOfBirth = member.DateOfBirth,
                            UserFirstName = user.FirstName,
                            UserLastName = user.LastName,
                            BranchId = user.BranchId,
                            OrganisationId = branch.OrganisationId
                        };

            //Get total before applying filters
            var pagedItems = new PagedItems<Model.Member.Model.Member.Member>();
            pagedItems.TotalItems = await query.CountAsync();

            //Apply filters ----------------------------------------------------------------------------------------
            if (!string.IsNullOrWhiteSpace(queryOptions.FirstName))
                query = query.Where(m => EF.Functions.Like(m.FirstName, $"%{queryOptions.FirstName}%"));

            if (!string.IsNullOrWhiteSpace(queryOptions.LastName))
                query = query.Where(m => EF.Functions.Like(m.LastName, $"%{queryOptions.LastName}%"));

            if (!string.IsNullOrWhiteSpace(queryOptions.IdNumber))
                query = query.Where(m => EF.Functions.Like(m.IdNumber, $"%{queryOptions.IdNumber}%"));

            if (queryOptions.UserIds.Any())
                query = query.Where(m => queryOptions.UserIds.Contains(m.UserId));
            //------------------------------------------------------------------------------------------------------

            //Ordering
            query = query.OrderBy(queryOptions.SortOptions.Column, queryOptions.SortOptions.Direction);

            //Paging
            pagedItems.Items = await query.TakePage(queryOptions.PageOptions.Number, queryOptions.PageOptions.Size).ToListAsync();

            return pagedItems;
        }

        public Task<MemberEdit> GetMember(ScopeOptions scope, Guid id)
        {
            var query = from member in GetMemberEntityQuery(scope)
                        where member.Id == id
                        select new MemberEdit()
                        {
                            Id = member.Id,
                            UserId = member.UserId,
                            FirstName = member.FirstName,
                            LastName = member.LastName,
                            MaidenName = member.MaidenName,
                            IdNumber = member.IdNumber,
                            Initials = member.Initials,
                            PreferredName = member.PreferredName,
                            DateOfBirth = member.DateOfBirth
                        };

            return query.FirstOrDefaultAsync();
        }

        public async Task<Result> InsertMember(string userId, MemberEdit member)
        {
            var validator = new MemberValidator(true);
            var result = validator.Validate(member).GetResult();

            if (!result.Success)
                return result;

            var entity = MapModelToEntity(member);
            entity.UserId = userId;
            await _context.Member.AddAsync(entity);
            await _context.SaveChangesAsync();

            member.Id = entity.Id;
            result.Tag = member;

            return result;
        }

        public async Task<Result> UpdateMember(ScopeOptions scope, MemberEdit member)
        {
            var validator = new MemberValidator(false);
            var result = validator.Validate(member).GetResult();

            if (!result.Success)
                return result;

            var query = from mem in GetMemberEntityQuery(scope)
                        where mem.Id == member.Id
                        select mem;

            var entity = await query.SingleOrDefaultAsync();

            if (entity == null)
                return new Result();

            var memberEntity = MapModelToEntity(member, entity);

            await _context.SaveChangesAsync();

            return result;
        }

        private IQueryable<MemberEntity> GetMemberEntityQuery(ScopeOptions scope)
        {
            var userQuery = ScopeQuery.GetUserEntityQuery(_context, scope);

            var query = from member in _context.Member
                        join user in userQuery
                             on member.UserId equals user.Id
                        select member;

            return query;
        }

        private MemberEntity MapModelToEntity(MemberEdit model, MemberEntity entity = null)
        {
            if (entity == null)
                entity = new MemberEntity();

            entity.FirstName = model.FirstName;
            entity.LastName = model.LastName;
            entity.MaidenName = model.MaidenName;
            entity.IdNumber = model.IdNumber;
            entity.Initials = model.Initials;
            entity.PreferredName = model.PreferredName;
            entity.DateOfBirth = model.DateOfBirth;

            return entity;
        }

    }
}