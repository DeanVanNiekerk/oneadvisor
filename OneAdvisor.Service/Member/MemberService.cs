using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using OneAdvisor.Data;
using OneAdvisor.Data.Entities.Member;
using OneAdvisor.Model;
using OneAdvisor.Model.Common;
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

        public Task<MemberEdit> GetMember(Guid id)
        {
            var query = from member in _context.Member
                        where member.Id == id
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

        public async Task<Result> InsertMember(MemberEdit member)
        {
            var validator = new MemberValidator(true);
            var result = validator.Validate(member).GetResult();

            if (!result.Success)
                return result;

            var entity = MapModelToEntity(member);
            await _context.Member.AddAsync(entity);
            await _context.SaveChangesAsync();

            member.Id = entity.Id;
            result.Tag = member;

            return result;
        }

        public async Task<Result> UpdateMember(MemberEdit member)
        {
            var validator = new MemberValidator(false);
            var result = validator.Validate(member).GetResult();

            if (!result.Success)
                return result;

            var entity = MapModelToEntity(member);
            _context.Entry(entity).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return result;
        }

        private MemberEntity MapModelToEntity(MemberEdit model)
        {
            return new MemberEntity()
            {
                Id = model.Id.HasValue ? model.Id.Value : Guid.Empty,
                FirstName = model.FirstName,
                LastName = model.LastName,
                MaidenName = model.MaidenName,
                IdNumber = model.IdNumber,
                Initials = model.Initials,
                PreferredName = model.PreferredName,
                DateOfBirth = model.DateOfBirth
            };
        }
    }
}