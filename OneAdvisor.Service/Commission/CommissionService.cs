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

namespace OneAdvisor.Service.Commission
{
    public class CommissionService : ICommissionService
    {
        private readonly DataContext _context;

        public CommissionService(DataContext context)
        {
            _context = context;
        }

        public async Task<PagedCommissions> GetCommissions(CommissionQueryOptions queryOptions)
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
                            CommissionStatementId = commission.CommissionStatementId,
                            PolicyId = commission.PolicyId,
                            CommissionTypeId = commission.CommissionTypeId,
                            AmountIncludingVAT = commission.AmountIncludingVAT,
                            VAT = commission.VAT,
                            UserId = policy.UserId,
                            PolicyNumber = policy.Number
                        };

            //Apply filters ----------------------------------------------------------------------------------------
            if (queryOptions.CommissionStatementId.HasValue)
                query = query.Where(c => c.CommissionStatementId == queryOptions.CommissionStatementId);

            if (queryOptions.UserId.Any())
                query = query.Where(c => queryOptions.UserId.Contains(c.UserId));

            if (queryOptions.CommissionTypeId.Any())
                query = query.Where(c => queryOptions.CommissionTypeId.Contains(c.CommissionTypeId));

            if (!string.IsNullOrWhiteSpace(queryOptions.PolicyNumber))
                query = query.Where(m => EF.Functions.Like(m.PolicyNumber, queryOptions.PolicyNumber));
            //------------------------------------------------------------------------------------------------------

            var pagedItems = new PagedCommissions();

            //Get total items
            pagedItems.TotalItems = await query.CountAsync();

            //Aggregations
            var aggQuery = from commission in query
                           select new
                           {
                               SumAmountIncludingVAT = query.Select(c => (decimal?)c.AmountIncludingVAT).Sum(),
                               SumVAT = query.Select(c => (decimal?)c.VAT).Sum(),
                               AverageAmountIncludingVAT = query.Select(c => (decimal?)c.AmountIncludingVAT).Average(),
                               AverageVAT = query.Select(c => (decimal?)c.VAT).Average()
                           };

            var aggregates = await aggQuery.FirstOrDefaultAsync();
            if (aggregates != null)
            {
                pagedItems.SumAmountIncludingVAT = aggregates.SumAmountIncludingVAT.Value;
                pagedItems.SumVAT = aggregates.SumVAT.Value;
                pagedItems.AverageAmountIncludingVAT = aggregates.AverageAmountIncludingVAT.Value;
                pagedItems.AverageVAT = aggregates.AverageVAT.Value;
            }

            //Ordering
            query = query.OrderBy(queryOptions.SortOptions.Column, queryOptions.SortOptions.Direction);

            //Paging
            pagedItems.Items = await query.TakePage(queryOptions.PageOptions.Number, queryOptions.PageOptions.Size).ToListAsync();

            return pagedItems;
        }

        public async Task<CommissionEdit> GetCommission(ScopeOptions scope, Guid id)
        {
            var query = from commission in GetCommissionEditQuery(scope)
                        where commission.Id == id
                        select commission;

            return await query.FirstOrDefaultAsync();
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
            entity.CommissionStatementId = commission.CommissionStatementId.Value;
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

        public async Task DeleteCommissions(ScopeOptions scope, Guid commissionStatementId)
        {
            var organisationQuery = ScopeQuery.GetOrganisationEntityQuery(_context, scope);

            var query = from organisation in organisationQuery
                        join commissionStatement in _context.CommissionStatement
                            on organisation.Id equals commissionStatement.OrganisationId
                        where commissionStatement.Id == commissionStatementId
                        select commissionStatement;

            var statement = await query
                        .Include(s => s.Commissions)
                        .Include(s => s.CommissionErrors)
                        .FirstOrDefaultAsync();

            if (statement == null)
                return;

            statement.Commissions.Clear();
            statement.CommissionErrors.Clear();

            await _context.SaveChangesAsync();
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

        private IQueryable<CommissionEdit> GetCommissionEditQuery(ScopeOptions scope)
        {
            return GetCommissionEntityQuery(scope)
                .Select(entity => new CommissionEdit()
                {
                    Id = entity.Id,
                    CommissionTypeId = entity.CommissionTypeId,
                    CommissionStatementId = entity.CommissionStatementId,
                    AmountIncludingVAT = entity.AmountIncludingVAT,
                    VAT = entity.VAT,
                    PolicyId = entity.PolicyId,
                });
        }

        private CommissionEntity MapModelToEntity(CommissionEdit model, CommissionEntity entity = null)
        {
            if (entity == null)
                entity = new CommissionEntity();

            entity.CommissionTypeId = model.CommissionTypeId.Value;
            entity.AmountIncludingVAT = model.AmountIncludingVAT.Value;
            entity.VAT = model.VAT.Value;
            entity.PolicyId = model.PolicyId.Value;

            return entity;
        }

        private CommissionEdit MapEntityToModel(CommissionEntity entity)
        {
            return new CommissionEdit()
            {
                Id = entity.Id,
                CommissionTypeId = entity.CommissionTypeId,
                CommissionStatementId = entity.CommissionStatementId,
                AmountIncludingVAT = entity.AmountIncludingVAT,
                VAT = entity.VAT,
                PolicyId = entity.PolicyId,
            };
        }
    }
}