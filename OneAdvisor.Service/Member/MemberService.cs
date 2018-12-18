using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using OneAdvisor.Data;
using OneAdvisor.Data.Entities.Member;
using OneAdvisor.Model;
using OneAdvisor.Model.Common;
using OneAdvisor.Model.Exceptions;
using OneAdvisor.Model.Member.Interface;
using OneAdvisor.Model.Member.Model.Member;

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
            var query = from member in _context.Member
                        where member.OrganisationId == queryOptions.OrganisationId
                        select new Model.Member.Model.Member.Member()
                        {
                            Id = member.Id,
                            FirstName = member.FirstName,
                            LastName = member.LastName,
                            MaidenName = member.MaidenName,
                            IdNumber = member.IdNumber,
                            Initials = member.Initials,
                            PreferredName = member.PreferredName,
                            DateOfBirth = member.DateOfBirth
                        };

            //Get total before applying filters
            var pagedItems = new PagedItems<Model.Member.Model.Member.Member>();
            pagedItems.TotalItems = await query.CountAsync();

            //Apply filters ----------------------------------------------------------------------------------------

            //------------------------------------------------------------------------------------------------------

            //Ordering
            query = query.OrderBy(queryOptions.SortOptions.Column, queryOptions.SortOptions.Direction);

            //Paging
            pagedItems.Items = await query.TakePage(queryOptions.PageOptions.Number, queryOptions.PageOptions.Size).ToListAsync();

            return pagedItems;
        }

        public Task<MemberEdit> GetMember(Guid organisationId, Guid id)
        {
            var query = from member in _context.Member
                        where member.OrganisationId == organisationId
                        && member.Id == id
                        select new MemberEdit()
                        {
                            Id = member.Id,
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

        public async Task<Result> InsertMember(Guid organisationId, MemberEdit member)
        {
            var validator = new MemberValidator(true);
            var result = validator.Validate(member).GetResult();

            if (!result.Success)
                return result;

            var entity = MapModelToEntity(member);
            entity.OrganisationId = organisationId;
            await _context.Member.AddAsync(entity);
            await _context.SaveChangesAsync();

            member.Id = entity.Id;
            result.Tag = member;

            return result;
        }

        public async Task<Result> UpdateMember(Guid organisationId, MemberEdit member)
        {
            var validator = new MemberValidator(false);
            var result = validator.Validate(member).GetResult();

            if (!result.Success)
                return result;

            var entity = await _context.Member.FindAsync(member.Id);

            if (entity.OrganisationId != organisationId)
                throw new IllegalAccessException(organisationId, entity.OrganisationId, member);

            var memberEntity = MapModelToEntity(member, entity);

            await _context.SaveChangesAsync();

            return result;
        }

        private MemberEntity MapModelToEntity(MemberEdit model, MemberEntity entity = null)
        {
            if (entity == null)
                entity = new MemberEntity();

            entity.Id = model.Id.HasValue ? model.Id.Value : Guid.Empty;
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