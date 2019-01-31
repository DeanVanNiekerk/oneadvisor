using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using OneAdvisor.Data;
using OneAdvisor.Data.Entities.Commission;
using OneAdvisor.Model;
using OneAdvisor.Model.Common;
using OneAdvisor.Model.Directory.Model.Auth;
using OneAdvisor.Model.Commission.Interface;
using OneAdvisor.Model.Commission.Model.Commission;
using OneAdvisor.Service.Common.Query;
using OneAdvisor.Service.Commission.Validators;

namespace OneAdvisor.Service.Commission
{
    public class CommissionService : ICommissionService
    {
        private readonly DataContext _context;

        public CommissionService(DataContext context)
        {
            _context = context;
        }

        public async Task<PagedItems<OneAdvisor.Model.Commission.Model.Commission.Commission>> GetCommissions(CommissionQueryOptions queryOptions)
        {
            var userQuery = ScopeQuery.GetUserEntityQuery(_context, queryOptions.Scope);

            var query = from user in userQuery
                        join policy in _context.Policy
                            on user.Id equals policy.UserId
                        join commission in _context.Commission
                            on policy.Id equals commission.PolicyId
                        select new OneAdvisor.Model.Commission.Model.Commission.Commission()
                        {
                            Id = commission.Id,
                            PolicyId = commission.PolicyId,
                            CommissionTypeId = commission.CommissionTypeId,
                            AmountIncludingVAT = commission.AmountIncludingVAT,
                            VAT = commission.VAT,
                            Date = commission.Date,
                            UserId = policy.UserId
                        };

            //Apply filters ----------------------------------------------------------------------------------------
            if (queryOptions.UserId.Any())
                query = query.Where(c => queryOptions.UserId.Contains(c.UserId));
            //------------------------------------------------------------------------------------------------------

            var pagedItems = new PagedItems<OneAdvisor.Model.Commission.Model.Commission.Commission>();

            //Get total items
            pagedItems.TotalItems = await query.CountAsync();

            //Ordering
            query = query.OrderBy(queryOptions.SortOptions.Column, queryOptions.SortOptions.Direction);

            //Paging
            pagedItems.Items = await query.TakePage(queryOptions.PageOptions.Number, queryOptions.PageOptions.Size).ToListAsync();

            return pagedItems;
        }

        public Task<CommissionEdit> GetCommission(ScopeOptions scope, Guid id)
        {
            var query = from commission in GetCommissionEditQuery(scope)
                        where commission.Id == id
                        select commission;

            return query.FirstOrDefaultAsync();
        }

        public async Task<Result> InsertCommission(ScopeOptions scope, CommissionEdit commission)
        {
            var validator = new CommissionValidator(true);
            var result = validator.Validate(commission).GetResult();

            if (!result.Success)
                return result;

            var policy = await _context.Policy.FindAsync(commission.PolicyId);
            result = await ScopeQuery.CheckScope(_context, scope, policy.MemberId, policy.UserId);

            if (!result.Success)
                return result;

            var entity = MapModelToEntity(commission);
            await _context.Commission.AddAsync(entity);
            await _context.SaveChangesAsync();

            commission.Id = entity.Id;
            result.Tag = commission;

            return result;
        }

        public async Task<Result> UpdateCommission(ScopeOptions scope, CommissionEdit commission)
        {
            var validator = new CommissionValidator(false);
            var result = validator.Validate(commission).GetResult();

            if (!result.Success)
                return result;

            var policy = await _context.Policy.FindAsync(commission.PolicyId);
            result = await ScopeQuery.CheckScope(_context, scope, policy.MemberId, policy.UserId);

            if (!result.Success)
                return result;

            var entity = await _context.Commission.FindAsync(commission.Id);

            if (entity == null)
                return new Result();

            var memberEntity = MapModelToEntity(commission, entity);

            await _context.SaveChangesAsync();

            return result;
        }

        private IQueryable<CommissionEdit> GetCommissionEditQuery(ScopeOptions scope)
        {
            var query = from commission in GetCommissionEntityQuery(scope)
                        select new CommissionEdit()
                        {
                            Id = commission.Id,
                            PolicyId = commission.PolicyId,
                            CommissionTypeId = commission.CommissionTypeId,
                            AmountIncludingVAT = commission.AmountIncludingVAT,
                            VAT = commission.VAT,
                            Date = commission.Date,
                        };

            return query;
        }

        private IQueryable<CommissionEntity> GetCommissionEntityQuery(ScopeOptions scope)
        {
            var userQuery = ScopeQuery.GetUserEntityQuery(_context, scope);

            var query = from user in userQuery
                        join policy in _context.Policy
                            on user.Id equals policy.UserId
                        join commission in _context.Commission
                            on policy.Id equals commission.PolicyId
                        select commission;

            return query;
        }

        private CommissionEntity MapModelToEntity(CommissionEdit model, CommissionEntity entity = null)
        {
            if (entity == null)
                entity = new CommissionEntity();

            entity.CommissionTypeId = model.CommissionTypeId.Value;
            entity.AmountIncludingVAT = model.AmountIncludingVAT;
            entity.VAT = model.VAT;
            entity.Date = model.Date.Value;
            entity.PolicyId = model.PolicyId.Value;

            return entity;
        }
    }
}