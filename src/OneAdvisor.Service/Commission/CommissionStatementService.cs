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
using OneAdvisor.Service.Common.Query;
using OneAdvisor.Service.Commission.Validators;
using OneAdvisor.Model.Commission.Model.CommissionStatement;
using OneAdvisor.Service.Common.BulkActions;
using OneAdvisor.Model.Directory.Interface;
using OneAdvisor.Model.Directory.Model.Audit;

namespace OneAdvisor.Service.Commission
{
    public class CommissionStatementService : ICommissionStatementService
    {
        private readonly DataContext _context;
        private readonly IBulkActions _bulkActions;
        private readonly IAuditService _auditService;

        public CommissionStatementService(DataContext context, IBulkActions bulkActions, IAuditService auditService)
        {
            _context = context;
            _bulkActions = bulkActions;
            _auditService = auditService;
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

            if (!string.IsNullOrWhiteSpace(queryOptions.Notes))
                query = query.Where(m => EF.Functions.Like(m.Notes, queryOptions.Notes));
            //------------------------------------------------------------------------------------------------------

            var pagedItems = new PagedCommissionStatements();

            //Get total items
            pagedItems.TotalItems = await query.CountAsync();

            //Aggregations
            var userQuery = ScopeQuery.GetUserEntityQuery(_context, queryOptions.Scope);

            var commissionQuery = from user in userQuery
                                  join commission in _context.Commission
                                    on user.Id equals commission.UserId
                                  join commissionStatement in query
                                    on commission.CommissionStatementId equals commissionStatement.Id
                                  select new
                                  {
                                      CommissionStatementId = commission.CommissionStatementId,
                                      AmountIncludingVAT = commission.AmountIncludingVAT,
                                      VAT = commission.VAT,
                                  };

            var aggQuery = from commission in commissionQuery
                           select new
                           {
                               SumAmountIncludingVAT = commissionQuery.Select(c => (decimal?)c.AmountIncludingVAT).Sum(),
                               SumVAT = commissionQuery.Select(c => (decimal?)c.VAT).Sum(),
                           };

            var aggregates = await aggQuery.FirstOrDefaultAsync();
            if (aggregates != null)
            {
                pagedItems.SumAmountIncludingVAT = aggregates.SumAmountIncludingVAT.Value;
                pagedItems.SumVAT = aggregates.SumVAT.Value;
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
                                 Notes = commissionStatement.Notes,
                                 ActualAmountIncludingVAT = commissionQuery.Where(c => c.CommissionStatementId == commissionStatement.Id).Select(c => c.AmountIncludingVAT).Sum(),
                                 ActualVAT = commissionQuery.Where(c => c.CommissionStatementId == commissionStatement.Id).Select(c => c.VAT).Sum(),
                                 CommissionCount = commissionQuery.Where(c => c.CommissionStatementId == commissionStatement.Id).Count(),
                                 MappingErrorCount = commissionStatement.CommissionErrors.Count(),
                                 CompanyName = commissionStatement.Company.Name
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
            var validator = new CommissionStatementValidator(_context, scope, true);
            var result = validator.Validate(commissionStatement).GetResult();

            if (!result.Success)
                return result;

            var entity = MapModelToEntity(commissionStatement);
            entity.OrganisationId = scope.OrganisationId;
            await _context.CommissionStatement.AddAsync(entity);
            await _context.SaveChangesAsync();

            commissionStatement.Id = entity.Id;
            result.Tag = commissionStatement;

            await _auditService.InsertAuditLog(scope, AuditLog.ACTION_INSERT, "CommissionStatement", entity.Id, commissionStatement);

            return result;
        }

        public async Task<Result> UpdateCommissionStatement(ScopeOptions scope, CommissionStatementEdit commissionStatement)
        {
            var validator = new CommissionStatementValidator(_context, scope, false);
            var result = validator.Validate(commissionStatement).GetResult();

            if (!result.Success)
                return result;

            var entity = await GetCommissionStatementEntityQuery(scope).FirstOrDefaultAsync(c => c.Id == commissionStatement.Id);

            if (entity == null)
                return new Result();

            entity = MapModelToEntity(commissionStatement, entity);

            await _context.SaveChangesAsync();

            await _auditService.InsertAuditLog(scope, AuditLog.ACTION_UPDATE, "CommissionStatement", entity.Id, commissionStatement);

            return result;
        }

        public async Task DeleteCommissions(ScopeOptions scope, Guid commissionStatementId)
        {
            //Scope check
            var statement = await GetCommissionStatement(scope, commissionStatementId);

            if (statement == null)
                return;

            await _bulkActions.BatchDeleteCommissionsAsync(_context, commissionStatementId);
            await _bulkActions.BatchDeleteCommissionErrorsAsync(_context, commissionStatementId);

            await _auditService.InsertAuditLog(scope, "BulkDelete", "Commission", commissionStatementId, new { commissionStatementId = commissionStatementId });
        }

        private IQueryable<CommissionStatementEdit> GetCommissionStatementEditQuery(ScopeOptions scope)
        {
            var organisationQuery = ScopeQuery.GetOrganisationEntityQuery(_context, scope);

            var query = from commissionStatement in GetCommissionStatementEntityQuery(scope)
                        select new CommissionStatementEdit()
                        {
                            Id = commissionStatement.Id,
                            CompanyId = commissionStatement.CompanyId,
                            AmountIncludingVAT = commissionStatement.AmountIncludingVAT,
                            VAT = commissionStatement.VAT,
                            Date = commissionStatement.Date,
                            Processed = commissionStatement.Processed,
                            Notes = commissionStatement.Notes,
                        };

            return query;
        }

        private IQueryable<CommissionStatementEntity> GetCommissionStatementEntityQuery(ScopeOptions scope)
        {
            var organisationQuery = ScopeQuery.GetOrganisationEntityQuery(_context, scope);

            var query = from organisation in organisationQuery
                        join commissionStatement in _context.CommissionStatement
                            on organisation.Id equals commissionStatement.OrganisationId
                        select commissionStatement;

            return query;
        }

        private CommissionStatementEntity MapModelToEntity(CommissionStatementEdit model, CommissionStatementEntity entity = null)
        {
            if (entity == null)
                entity = new CommissionStatementEntity();

            entity.CompanyId = model.CompanyId.Value;
            entity.AmountIncludingVAT = model.AmountIncludingVAT.Value;
            entity.VAT = model.VAT.Value;
            entity.Date = model.Date.Value.Date;
            entity.Processed = model.Processed.Value;
            entity.Notes = model.Notes;

            return entity;
        }
    }
}