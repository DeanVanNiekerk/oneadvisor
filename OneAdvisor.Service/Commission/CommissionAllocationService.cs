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
                            PolicyIds = commissionAllocation.PolicyIds
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
            var query = from allocation in GetCommissionAllocationQuery(scope)
                        where allocation.Id == id
                        select allocation;

            return await query.FirstOrDefaultAsync();
        }

        public async Task<Result> DeleteCommissionAllocation(ScopeOptions scope, Guid commissionAllocationId)
        {
            var result = new Result();

            var entity = await GetCommissionAllocationEntityQuery(scope).FirstOrDefaultAsync(b => b.Id == commissionAllocationId);

            if (entity == null)
                return new Result();

            _context.CommissionAllocation.Remove(entity);

            await _context.SaveChangesAsync();

            return new Result(true);
        }

        public async Task<Result> InsertCommissionAllocation(ScopeOptions scope, CommissionAllocationEdit commissionAllocation)
        {
            var validator = new CommissionAllocationValidator(true);
            var result = validator.Validate(commissionAllocation).GetResult();

            if (!result.Success)
                return result;

            result = await ScopeQuery.CheckScope(_context, scope, commissionAllocation.FromClientId.Value, scope.UserId);
            if (!result.Success)
                return result;

            result = await ScopeQuery.CheckScope(_context, scope, commissionAllocation.ToClientId.Value, scope.UserId);
            if (!result.Success)
                return result;

            result = await ValidatePolicyIds(commissionAllocation.ToClientId.Value, commissionAllocation.PolicyIds);
            if (!result.Success)
                return result;

            var entity = MapModelToEntity(commissionAllocation);
            await _context.CommissionAllocation.AddAsync(entity);
            await _context.SaveChangesAsync();

            commissionAllocation.Id = entity.Id;
            result.Tag = commissionAllocation;

            return result;
        }

        public async Task<Result> UpdateCommissionAllocation(ScopeOptions scope, CommissionAllocationEdit commissionAllocation)
        {
            var validator = new CommissionAllocationValidator(false);
            var result = validator.Validate(commissionAllocation).GetResult();

            if (!result.Success)
                return result;

            result = await ScopeQuery.CheckScope(_context, scope, commissionAllocation.FromClientId.Value, scope.UserId);
            if (!result.Success)
                return result;

            result = await ScopeQuery.CheckScope(_context, scope, commissionAllocation.ToClientId.Value, scope.UserId);
            if (!result.Success)
                return result;

            result = await ValidatePolicyIds(commissionAllocation.ToClientId.Value, commissionAllocation.PolicyIds);
            if (!result.Success)
                return result;

            var entity = await _context.CommissionAllocation.FindAsync(commissionAllocation.Id);

            if (entity == null)
                return new Result();

            var allocationEntity = MapModelToEntity(commissionAllocation, entity);

            await _context.SaveChangesAsync();

            return result;
        }

        private async Task<Result> ValidatePolicyIds(Guid clientId, List<Guid> policyIds)
        {
            var result = new Result();

            var existing = await _context.Policy
                            .Where(p => p.ClientId == clientId)
                            .Select(p => p.Id)
                            .ToListAsync();

            result.Success = policyIds.All(p => existing.Contains(p));

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
                            PolicyIds = commissionAllocation.PolicyIds
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
            entity.PolicyIds = model.PolicyIds;

            return entity;
        }

    }
}