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
using OneAdvisor.Model.Commission.Model.CommissionStatement;

namespace OneAdvisor.Service.Commission
{
    public class CommissionStatementService : ICommissionStatementService
    {
        private readonly DataContext _context;

        public CommissionStatementService(DataContext context)
        {
            _context = context;
        }

        public async Task<PagedCommissionStatements> GetCommissionStatements(CommissionStatementQueryOptions queryOptions)
        {
            var organisationQuery = ScopeQuery.GetOrganisationEntityQuery(_context, queryOptions.Scope);

            var query = from organisation in organisationQuery
                        join commissionStatement in _context.CommissionStatement
                            on organisation.Id equals commissionStatement.OrganisationId
                        select commissionStatement;

            //Apply filters ----------------------------------------------------------------------------------------
            if (queryOptions.CommissionStatementId.HasValue)
                query = query.Where(c => c.Id == queryOptions.CommissionStatementId);

            if (queryOptions.CompanyId.Any())
                query = query.Where(c => queryOptions.CompanyId.Contains(c.CompanyId));

            if (queryOptions.Processed.HasValue)
                query = query.Where(c => c.Processed == queryOptions.Processed);

            if (queryOptions.StartDate.HasValue)
                query = query.Where(c => c.Date >= queryOptions.StartDate.Value.Date);

            if (queryOptions.EndDate.HasValue)
                query = query.Where(c => c.Date <= queryOptions.EndDate.Value.Date);
            //------------------------------------------------------------------------------------------------------

            var pagedItems = new PagedCommissionStatements();

            //Get total items
            pagedItems.TotalItems = await query.CountAsync();

            //Aggregations
            var commissionQuery = from commission in _context.Commission
                                  join statement in query
                                       on commission.CommissionStatementId equals statement.Id
                                  select commission;

            var aggQuery = from commission in commissionQuery
                           select new
                           {
                               SumAmountIncludingVAT = commissionQuery.Select(c => (decimal?)c.AmountIncludingVAT).Sum(),
                               SumVAT = commissionQuery.Select(c => (decimal?)c.VAT).Sum(),
                               AverageAmountIncludingVAT = commissionQuery.Select(c => (decimal?)c.AmountIncludingVAT).Average(),
                               AverageVAT = commissionQuery.Select(c => (decimal?)c.VAT).Average()
                           };

            var aggregates = await aggQuery.FirstOrDefaultAsync();
            if (aggregates != null)
            {
                pagedItems.SumAmountIncludingVAT = aggregates.SumAmountIncludingVAT.Value;
                pagedItems.SumVAT = aggregates.SumVAT.Value;
                pagedItems.AverageAmountIncludingVAT = aggregates.AverageAmountIncludingVAT.Value;
                pagedItems.AverageVAT = aggregates.AverageVAT.Value;
            }

            var modelQuery = from commissionStatement in query
                             select new CommissionStatement()
                             {
                                 Id = commissionStatement.Id,
                                 CompanyId = commissionStatement.CompanyId,
                                 AmountIncludingVAT = commissionStatement.AmountIncludingVAT,
                                 VAT = commissionStatement.VAT,
                                 Date = commissionStatement.Date,
                                 Processed = commissionStatement.Processed,
                                 ActualAmountIncludingVAT = commissionStatement.Commissions.Select(c => c.AmountIncludingVAT).Sum(),
                                 ActualVAT = commissionStatement.Commissions.Select(c => c.VAT).Sum(),
                                 CommissionCount = commissionStatement.Commissions.Count(),
                                 FormatErrorCount = commissionStatement.CommissionErrors.Count(e => !e.IsFormatValid),
                                 MappingErrorCount = commissionStatement.CommissionErrors.Count(e => e.IsFormatValid)
                             };

            //Ordering
            modelQuery = modelQuery.OrderBy(queryOptions.SortOptions.Column, queryOptions.SortOptions.Direction);

            //Paging
            pagedItems.Items = await modelQuery.TakePage(queryOptions.PageOptions.Number, queryOptions.PageOptions.Size).ToListAsync(); ;

            return pagedItems;
        }

        public Task<CommissionStatementEdit> GetCommissionStatement(ScopeOptions scope, Guid id)
        {
            var query = from statement in GetCommissionStatementEditQuery(scope)
                        where statement.Id == id
                        select statement;

            return query.FirstOrDefaultAsync();
        }

        public async Task<Result> InsertCommissionStatement(ScopeOptions scope, CommissionStatementEdit commissionStatement)
        {
            var validator = new CommissionStatementValidator(true);
            var result = validator.Validate(commissionStatement).GetResult();

            if (!result.Success)
                return result;

            var entity = MapModelToEntity(commissionStatement);
            entity.OrganisationId = scope.OrganisationId;
            await _context.CommissionStatement.AddAsync(entity);
            await _context.SaveChangesAsync();

            commissionStatement.Id = entity.Id;
            result.Tag = commissionStatement;

            return result;
        }

        public async Task<Result> UpdateCommissionStatement(ScopeOptions scope, CommissionStatementEdit commissionStatement)
        {
            var validator = new CommissionStatementValidator(false);
            var result = validator.Validate(commissionStatement).GetResult();

            if (!result.Success)
                return result;

            var entity = await _context.CommissionStatement.FindAsync(commissionStatement.Id);

            if (entity == null || entity.OrganisationId != scope.OrganisationId)
                return new Result();

            entity = MapModelToEntity(commissionStatement, entity);

            await _context.SaveChangesAsync();

            return result;
        }

        private IQueryable<CommissionStatementEdit> GetCommissionStatementEditQuery(ScopeOptions scope)
        {
            var organisationQuery = ScopeQuery.GetOrganisationEntityQuery(_context, scope);

            var query = from organisation in organisationQuery
                        join commissionStatement in _context.CommissionStatement
                            on organisation.Id equals commissionStatement.OrganisationId
                        select new CommissionStatementEdit()
                        {
                            Id = commissionStatement.Id,
                            CompanyId = commissionStatement.CompanyId,
                            AmountIncludingVAT = commissionStatement.AmountIncludingVAT,
                            VAT = commissionStatement.VAT,
                            Date = commissionStatement.Date,
                            Processed = commissionStatement.Processed
                        };

            return query;
        }

        private CommissionStatementEntity MapModelToEntity(CommissionStatementEdit model, CommissionStatementEntity entity = null)
        {
            if (entity == null)
                entity = new CommissionStatementEntity();

            entity.CompanyId = model.CompanyId.Value;
            entity.AmountIncludingVAT = model.AmountIncludingVAT.Value;
            entity.VAT = model.VAT.Value;
            entity.Date = model.Date.Value;
            entity.Processed = model.Processed.Value;

            return entity;
        }
    }
}