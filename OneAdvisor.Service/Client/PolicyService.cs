using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using OneAdvisor.Data;
using OneAdvisor.Data.Entities.Client;
using OneAdvisor.Model;
using OneAdvisor.Model.Common;
using OneAdvisor.Model.Account.Model.Authentication;
using OneAdvisor.Model.Client.Interface;
using OneAdvisor.Model.Client.Model.Policy;
using OneAdvisor.Service.Common.Query;
using OneAdvisor.Service.Client.Validators;

namespace OneAdvisor.Service.Client
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
                        join client in _context.Client
                            on policy.ClientId equals client.Id
                        select new Policy()
                        {
                            Id = policy.Id,
                            ClientId = policy.ClientId,
                            Number = policy.Number,
                            CompanyId = policy.CompanyId,
                            UserId = policy.UserId,
                            Premium = policy.Premium,
                            StartDate = policy.StartDate,
                            PolicyTypeId = policy.PolicyTypeId,
                            PolicyProductTypeId = policy.PolicyProductTypeId,
                            PolicyProductId = policy.PolicyProductId,
                            ClientLastName = client.LastName,
                            ClientInitials = client.Initials,
                            ClientDateOfBirth = client.DateOfBirth,
                        };

            //Apply filters ----------------------------------------------------------------------------------------
            if (queryOptions.Id.HasValue)
                query = query.Where(m => m.Id == queryOptions.Id.Value);

            if (queryOptions.ClientId.HasValue)
                query = query.Where(m => m.ClientId == queryOptions.ClientId.Value);

            if (queryOptions.CompanyId.Any())
                query = query.Where(m => queryOptions.CompanyId.Contains(m.CompanyId));

            if (queryOptions.PolicyTypeId.Any())
                query = query.Where(m => queryOptions.PolicyTypeId.Contains(m.PolicyTypeId.Value));

            if (queryOptions.UserId.Any())
                query = query.Where(m => queryOptions.UserId.Contains(m.UserId));

            if (!string.IsNullOrWhiteSpace(queryOptions.Number))
                query = query.Where(m => EF.Functions.Like(m.Number, queryOptions.Number));

            if (!string.IsNullOrWhiteSpace(queryOptions.ClientLastName))
                query = query.Where(m => EF.Functions.Like(m.ClientLastName, queryOptions.ClientLastName));
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

        public Task<PolicyEdit> GetPolicy(ScopeOptions scope, string number)
        {
            var query = from policy in GetPolicyEditQuery(scope)
                        where EF.Functions.Like(policy.Number, number)
                        select policy;

            return query.FirstOrDefaultAsync();
        }

        public Task<PolicyEdit> GetPolicy(ScopeOptions scope, Guid companyId, string number)
        {
            var query = from policy in GetPolicyEditQuery(scope)
                        where EF.Functions.Like(policy.Number, number)
                        && policy.CompanyId == companyId
                        select policy;

            return query.FirstOrDefaultAsync();
        }

        public Task<PolicyEdit> GetPolicy(ScopeOptions scope, Guid clientId, Guid companyId, string number)
        {
            var query = from policy in GetPolicyEditQuery(scope)
                        where EF.Functions.Like(policy.Number, number)
                        && policy.ClientId == clientId
                        && policy.CompanyId == companyId
                        select policy;

            return query.FirstOrDefaultAsync();
        }

        public async Task<Result> InsertPolicy(ScopeOptions scope, PolicyEdit policy)
        {
            var validator = new PolicyValidator(_context, scope, true);
            var result = validator.Validate(policy).GetResult();

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
            var validator = new PolicyValidator(_context, scope, false);
            var result = validator.Validate(policy).GetResult();

            if (!result.Success)
                return result;

            var entity = await GetPolicyEntityQuery(scope).FirstOrDefaultAsync(p => p.Id == policy.Id);

            if (entity == null)
                return new Result();

            var clientEntity = MapModelToEntity(policy, entity);

            await _context.SaveChangesAsync();

            return result;
        }

        private IQueryable<PolicyEdit> GetPolicyEditQuery(ScopeOptions scope)
        {
            var query = from policy in GetPolicyEntityQuery(scope)
                        select new PolicyEdit()
                        {
                            Id = policy.Id,
                            ClientId = policy.ClientId,
                            Number = policy.Number,
                            CompanyId = policy.CompanyId,
                            UserId = policy.UserId,
                            Premium = policy.Premium,
                            StartDate = policy.StartDate,
                            PolicyTypeId = policy.PolicyTypeId,
                            PolicyProductTypeId = policy.PolicyProductTypeId,
                            PolicyProductId = policy.PolicyProductId
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

            entity.ClientId = model.ClientId.Value;
            entity.Number = model.Number.TrimWhiteSpace(); ;
            entity.CompanyId = model.CompanyId.Value;
            entity.UserId = model.UserId.Value;
            entity.StartDate = model.StartDate;
            entity.Premium = model.Premium;
            entity.PolicyTypeId = model.PolicyTypeId;
            entity.PolicyProductTypeId = model.PolicyProductTypeId;
            entity.PolicyProductId = model.PolicyProductId;

            return entity;
        }

    }
}