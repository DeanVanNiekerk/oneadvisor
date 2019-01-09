using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using OneAdvisor.Data;
using OneAdvisor.Data.Entities.Member;
using OneAdvisor.Model;
using OneAdvisor.Model.Common;
using OneAdvisor.Model.Directory.Model.Auth;
using OneAdvisor.Model.Member.Interface;
using OneAdvisor.Model.Member.Model.MemberPolicy;
using OneAdvisor.Service.Common.Query;
using OneAdvisor.Service.Member.Validators;

namespace OneAdvisor.Service.Member
{
    public class MemberPolicyService : IMemberPolicyService
    {
        private readonly DataContext _context;

        public MemberPolicyService(DataContext context)
        {
            _context = context;
        }

        public async Task<PagedItems<MemberPolicy>> GetPolicies(MemberPolicyQueryOptions queryOptions)
        {
            var userQuery = ScopeQuery.GetUserEntityQuery(_context, queryOptions.Scope);

            var query = from user in userQuery
                        join member in _context.Member
                            on user.Id equals member.UserId
                        join memberPolicy in _context.MemberPolicy
                            on member.Id equals memberPolicy.MemberId
                        select new MemberPolicy()
                        {
                            Id = memberPolicy.Id,
                            MemberId = memberPolicy.MemberId,
                            Number = memberPolicy.Number,
                            CompanyId = memberPolicy.CompanyId
                        };

            //Get total before applying filters
            var pagedItems = new PagedItems<MemberPolicy>();
            pagedItems.TotalItems = await query.CountAsync();

            //Apply filters ----------------------------------------------------------------------------------------
            if (queryOptions.MemberId.HasValue)
                query = query.Where(m => m.MemberId == queryOptions.MemberId.Value);
            //------------------------------------------------------------------------------------------------------

            //Ordering
            query = query.OrderBy(queryOptions.SortOptions.Column, queryOptions.SortOptions.Direction);

            //Paging
            pagedItems.Items = await query.TakePage(queryOptions.PageOptions.Number, queryOptions.PageOptions.Size).ToListAsync();

            return pagedItems;
        }

        public Task<MemberPolicyEdit> GetPolicy(ScopeOptions scope, Guid id)
        {
            var query = from policy in GetMemberPolicyEditQuery(scope)
                        where policy.Id == id
                        select policy;

            return query.FirstOrDefaultAsync();
        }

        public Task<MemberPolicyEdit> GetPolicy(ScopeOptions scope, string number)
        {
            var query = from policy in GetMemberPolicyEditQuery(scope)
                        where policy.Number == number
                        select policy;

            return query.FirstOrDefaultAsync();
        }

        public async Task<Result> InsertPolicy(ScopeOptions scope, MemberPolicyEdit policy)
        {
            var validator = new MemberPolicyValidator(true);
            var result = validator.Validate(policy).GetResult();

            if (!result.Success)
                return result;

            result = await ScopeQuery.IsMemberInScopeResult(_context, scope, policy.MemberId);

            if (!result.Success)
                return result;

            var entity = MapModelToEntity(policy);
            await _context.MemberPolicy.AddAsync(entity);
            await _context.SaveChangesAsync();

            policy.Id = entity.Id;
            result.Tag = policy;

            return result;
        }

        public async Task<Result> UpdatePolicy(ScopeOptions scope, MemberPolicyEdit policy)
        {
            var validator = new MemberPolicyValidator(true);
            var result = validator.Validate(policy).GetResult();

            if (!result.Success)
                return result;

            result = await ScopeQuery.IsMemberInScopeResult(_context, scope, policy.MemberId);

            if (!result.Success)
                return result;

            var query = from pol in GetMemberPolicyEntityQuery(scope)
                        where pol.Id == pol.Id
                        select pol;

            var entity = await query.FirstOrDefaultAsync();

            if (entity == null)
                return new Result();

            var memberEntity = MapModelToEntity(policy, entity);

            await _context.SaveChangesAsync();

            return result;
        }

        private IQueryable<MemberPolicyEdit> GetMemberPolicyEditQuery(ScopeOptions scope)
        {
            var query = from policy in GetMemberPolicyEntityQuery(scope)
                        select new MemberPolicyEdit()
                        {
                            Id = policy.Id,
                            MemberId = policy.MemberId,
                            Number = policy.Number,
                            CompanyId = policy.CompanyId
                        };

            return query;
        }

        private IQueryable<MemberPolicyEntity> GetMemberPolicyEntityQuery(ScopeOptions scope)
        {
            var userQuery = ScopeQuery.GetUserEntityQuery(_context, scope);

            var query = from user in userQuery
                        join member in _context.Member
                            on user.Id equals member.UserId
                        join memberPolicy in _context.MemberPolicy
                            on member.Id equals memberPolicy.MemberId
                        select memberPolicy;

            return query;
        }

        private MemberPolicyEntity MapModelToEntity(MemberPolicyEdit model, MemberPolicyEntity entity = null)
        {
            if (entity == null)
                entity = new MemberPolicyEntity();

            entity.Id = model.Id.HasValue ? model.Id.Value : Guid.Empty;
            entity.MemberId = model.MemberId;
            entity.Number = model.Number;
            entity.CompanyId = model.CompanyId;

            return entity;
        }

    }
}