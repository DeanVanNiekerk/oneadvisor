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
using OneAdvisor.Model.Member.Model.Policy;
using OneAdvisor.Service.Common.Query;
using OneAdvisor.Service.Member.Validators;

namespace OneAdvisor.Service.Member
{
    public class PolicyService : IPolicyService
    {
        private readonly DataContext _context;

        public PolicyService(DataContext context)
        {
            _context = context;
        }

        public async Task<PagedItems<Policy>> GetPolicies(PolicyQueryOptions queryOptions)
        {
            var userQuery = ScopeQuery.GetUserEntityQuery(_context, queryOptions.Scope);

            var query = from user in userQuery
                        join policy in _context.Policy
                            on user.Id equals policy.UserId
                        select new Policy()
                        {
                            Id = policy.Id,
                            MemberId = policy.MemberId,
                            Number = policy.Number,
                            CompanyId = policy.CompanyId,
                            UserId = policy.UserId
                        };

            //Apply filters ----------------------------------------------------------------------------------------
            if (queryOptions.MemberId.HasValue)
                query = query.Where(m => m.MemberId == queryOptions.MemberId.Value);

            if (queryOptions.CompanyId.HasValue)
                query = query.Where(m => m.CompanyId == queryOptions.CompanyId.Value);

            if (!string.IsNullOrWhiteSpace(queryOptions.UserId))
                query = query.Where(m => m.UserId == queryOptions.UserId);

            if (!string.IsNullOrWhiteSpace(queryOptions.Number))
                query = query.Where(m => EF.Functions.Like(m.Number, $"{queryOptions.Number}"));
            //------------------------------------------------------------------------------------------------------

            var pagedItems = new PagedItems<Policy>();

            //Get total items
            pagedItems.TotalItems = await query.CountAsync();

            //Ordering
            query = query.OrderBy(queryOptions.SortOptions.Column, queryOptions.SortOptions.Direction);

            //Paging
            pagedItems.Items = await query.TakePage(queryOptions.PageOptions.Number, queryOptions.PageOptions.Size).ToListAsync();

            return pagedItems;
        }

        public Task<PolicyEdit> GetPolicy(ScopeOptions scope, Guid id)
        {
            var query = from policy in GetPolicyEditQuery(scope)
                        where policy.Id == id
                        select policy;

            return query.FirstOrDefaultAsync();
        }

        public Task<PolicyEdit> GetPolicy(ScopeOptions scope, Guid memberId, Guid companyId, string number)
        {
            var query = from policy in GetPolicyEditQuery(scope)
                        where policy.Number == number
                        && policy.MemberId == memberId
                        && policy.CompanyId == companyId
                        select policy;

            return query.FirstOrDefaultAsync();
        }

        public async Task<Result> InsertPolicy(ScopeOptions scope, PolicyEdit policy)
        {
            var validator = new PolicyValidator(true);
            var result = validator.Validate(policy).GetResult();

            if (!result.Success)
                return result;

            result = await ScopeQuery.CheckScope(_context, scope, policy.MemberId, policy.UserId);

            if (!result.Success)
                return result;

            var entity = MapModelToEntity(policy);
            await _context.Policy.AddAsync(entity);
            await _context.SaveChangesAsync();

            policy.Id = entity.Id;
            result.Tag = policy;

            return result;
        }

        public async Task<Result> UpdatePolicy(ScopeOptions scope, PolicyEdit policy)
        {
            var validator = new PolicyValidator(true);
            var result = validator.Validate(policy).GetResult();

            if (!result.Success)
                return result;

            result = await ScopeQuery.CheckScope(_context, scope, policy.MemberId, policy.UserId);

            if (!result.Success)
                return result;

            var entity = await _context.Policy.FindAsync(policy.Id);

            if (entity == null)
                return new Result();

            var memberEntity = MapModelToEntity(policy, entity);

            await _context.SaveChangesAsync();

            return result;
        }

        private IQueryable<PolicyEdit> GetPolicyEditQuery(ScopeOptions scope)
        {
            var query = from policy in GetPolicyEntityQuery(scope)
                        select new PolicyEdit()
                        {
                            Id = policy.Id,
                            MemberId = policy.MemberId,
                            Number = policy.Number,
                            CompanyId = policy.CompanyId,
                            UserId = policy.UserId
                        };

            return query;
        }

        private IQueryable<PolicyEntity> GetPolicyEntityQuery(ScopeOptions scope)
        {
            var userQuery = ScopeQuery.GetUserEntityQuery(_context, scope);

            var query = from user in userQuery
                        join policy in _context.Policy
                            on user.Id equals policy.UserId
                        select policy;

            return query;
        }

        private PolicyEntity MapModelToEntity(PolicyEdit model, PolicyEntity entity = null)
        {
            if (entity == null)
                entity = new PolicyEntity();

            entity.MemberId = model.MemberId;
            entity.Number = model.Number;
            entity.CompanyId = model.CompanyId;
            entity.UserId = model.UserId;

            return entity;
        }

    }
}