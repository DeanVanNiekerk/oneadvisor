using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using OneAdvisor.Data;
using OneAdvisor.Data.Entities.Commission;
using OneAdvisor.Model;
using OneAdvisor.Model.Common;
using OneAdvisor.Model.Account.Model.Authentication;
using OneAdvisor.Model.Commission.Interface;
using OneAdvisor.Model.Commission.Model.Commission;
using OneAdvisor.Service.Common.Query;
using OneAdvisor.Service.Commission.Validators;
using System.Collections;
using System.Collections.Generic;
using OneAdvisor.Model.Commission.Model.CommissionAllocation;

namespace OneAdvisor.Service.Commission
{
    public class CommissionAllocationService : ICommissionAllocationService
    {
        private readonly DataContext _context;

        public CommissionAllocationService(DataContext context)
        {
            _context = context;
        }

        public async Task<PagedItems<CommissionAllocation>> GetCommissionAllocations(CommissionAllocationQueryOptions queryOptions)
        {
            var clientQuery = ScopeQuery.GetClientEntityQuery(_context, queryOptions.Scope);

            var query = from commissionAllocation in _context.CommissionAllocation
                        join fromClient in clientQuery
                            on commissionAllocation.FromClientId equals fromClient.Id
                        join toClient in clientQuery
                            on commissionAllocation.ToClientId equals toClient.Id
                        select new CommissionAllocation()
                        {
                            Id = commissionAllocation.Id,
                            FromClientId = commissionAllocation.FromClientId,
                            ToClientId = commissionAllocation.ToClientId,
                            PolicyIdCount = commissionAllocation.CommissionAllocationPolicies.Count(),
                            FromClientFirstName = fromClient.FirstName,
                            FromClientLastName = fromClient.LastName
                        };

            //Apply filters ----------------------------------------------------------------------------------------
            if (queryOptions.FromClientId.Any())
                query = query.Where(c => queryOptions.FromClientId.Contains(c.FromClientId));

            if (queryOptions.ToClientId.Any())
                query = query.Where(c => queryOptions.ToClientId.Contains(c.ToClientId));
            //------------------------------------------------------------------------------------------------------

            var pagedItems = new PagedItems<CommissionAllocation>();

            //Get total items
            pagedItems.TotalItems = await query.CountAsync();

            //Ordering
            query = query.OrderBy(queryOptions.SortOptions.Column, queryOptions.SortOptions.Direction);

            //Paging
            pagedItems.Items = await query.TakePage(queryOptions.PageOptions.Number, queryOptions.PageOptions.Size).ToListAsync();

            return pagedItems;
        }

        public async Task<CommissionAllocationEdit> GetCommissionAllocation(ScopeOptions scope, Guid id)
        {
            var query = from a in GetCommissionAllocationQuery(scope)
                        where a.Id == id
                        select a;

            var allocation = await query.FirstOrDefaultAsync();

            if (allocation == null)
                return null;

            allocation.PolicyIds = await _context.CommissionAllocationPolicy
                                            .Where(a => a.CommissionAllocationId == allocation.Id)
                                            .Select(a => a.PolicyId)
                                            .ToListAsync();

            return allocation;
        }

        public async Task<Result> DeleteCommissionAllocation(ScopeOptions scope, Guid commissionAllocationId)
        {
            var result = new Result();

            var entity = await GetCommissionAllocationEntityQuery(scope).FirstOrDefaultAsync(b => b.Id == commissionAllocationId);

            if (entity == null)
                return new Result();

            //Delete dependancies
            await DeleteCommissionAllocationPolicies(commissionAllocationId);

            _context.CommissionAllocation.Remove(entity);

            await _context.SaveChangesAsync();

            return new Result(true);
        }

        public async Task<Result> InsertCommissionAllocation(ScopeOptions scope, CommissionAllocationEdit commissionAllocation)
        {
            var validator = new CommissionAllocationValidator(_context, scope, true);
            var result = validator.Validate(commissionAllocation).GetResult();

            if (!result.Success)
                return result;

            var entity = MapModelToEntity(commissionAllocation);
            await _context.CommissionAllocation.AddAsync(entity);
            await _context.SaveChangesAsync();

            commissionAllocation.Id = entity.Id;
            result.Tag = commissionAllocation;

            await InsertCommissionAllocationPolicies(commissionAllocation);

            return result;
        }

        private async Task InsertCommissionAllocationPolicies(CommissionAllocationEdit commissionAllocation)
        {
            foreach (var policyId in commissionAllocation.PolicyIds)
            {
                var allocationPolicy = BuildCommissionAllocationPolicyEntity(commissionAllocation.Id.Value, policyId);
                await _context.CommissionAllocationPolicy.AddAsync(allocationPolicy);
            }

            await _context.SaveChangesAsync();
        }

        private async Task DeleteCommissionAllocationPolicies(Guid commissionAllocationId)
        {
            var allocationPolicies = await _context.CommissionAllocationPolicy.Where(a => a.CommissionAllocationId == commissionAllocationId).ToListAsync();

            foreach (var allocationPolicy in allocationPolicies)
                _context.CommissionAllocationPolicy.Remove(allocationPolicy);

            await _context.SaveChangesAsync();
        }

        public async Task<Result> UpdateCommissionAllocation(ScopeOptions scope, CommissionAllocationEdit commissionAllocation)
        {
            var validator = new CommissionAllocationValidator(_context, scope, false);
            var result = validator.Validate(commissionAllocation).GetResult();

            if (!result.Success)
                return result;

            var entity = await GetCommissionAllocationEntityQuery(scope).FirstOrDefaultAsync(c => c.Id == commissionAllocation.Id);

            if (entity == null)
                return new Result();

            var allocationEntity = MapModelToEntity(commissionAllocation, entity);

            await _context.SaveChangesAsync();

            await DeleteCommissionAllocationPolicies(commissionAllocation.Id.Value);
            await InsertCommissionAllocationPolicies(commissionAllocation);

            return result;
        }

        private IQueryable<CommissionAllocationEdit> GetCommissionAllocationQuery(ScopeOptions scope)
        {
            var query = from commissionAllocation in GetCommissionAllocationEntityQuery(scope)
                        select new CommissionAllocationEdit()
                        {
                            Id = commissionAllocation.Id,
                            FromClientId = commissionAllocation.FromClientId,
                            ToClientId = commissionAllocation.ToClientId,
                        };

            return query;
        }

        private IQueryable<CommissionAllocationEntity> GetCommissionAllocationEntityQuery(ScopeOptions scope)
        {
            var clientQuery = ScopeQuery.GetClientEntityQuery(_context, scope);

            var query = from commissionAllocation in _context.CommissionAllocation
                        join fromClient in clientQuery
                            on commissionAllocation.FromClientId equals fromClient.Id
                        join toClient in clientQuery
                            on commissionAllocation.ToClientId equals toClient.Id
                        select commissionAllocation;

            return query;
        }

        private CommissionAllocationEntity MapModelToEntity(CommissionAllocationEdit model, CommissionAllocationEntity entity = null)
        {
            if (entity == null)
                entity = new CommissionAllocationEntity();

            entity.FromClientId = model.FromClientId.Value;
            entity.ToClientId = model.ToClientId.Value;

            return entity;
        }

        private CommissionAllocationPolicyEntity BuildCommissionAllocationPolicyEntity(Guid commissionAllocationId, Guid policyId)
        {
            var entity = new CommissionAllocationPolicyEntity();

            entity.CommissionAllocationId = commissionAllocationId;
            entity.PolicyId = policyId;

            return entity;
        }

    }
}