using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using OneAdvisor.Data;
using OneAdvisor.Data.Entities.Commission;
using OneAdvisor.Model;
using OneAdvisor.Model.Commission.Interface;
using OneAdvisor.Model.Commission.Model.Commission;
using OneAdvisor.Model.Commission.Model.CommissionError;
using OneAdvisor.Model.Commission.Model.ImportCommission;
using OneAdvisor.Model.Common;
using OneAdvisor.Model.Directory.Interface;
using OneAdvisor.Model.Account.Model.Authentication;
using OneAdvisor.Model.Directory.Model.User;
using OneAdvisor.Service.Commission.Validators;
using OneAdvisor.Service.Common.Query;
using System.Collections.Generic;

namespace OneAdvisor.Service.Commission
{
    public class CommissionErrorService : ICommissionErrorService
    {
        private readonly DataContext _context;
        private readonly ICommissionService _commissionService;

        public CommissionErrorService(DataContext context, ICommissionService commissionService)
        {
            _context = context;
            _commissionService = commissionService;
        }

        public async Task<PagedItems<CommissionError>> GetErrors(CommissionErrorQueryOptions queryOptions)
        {
            var query = from commissionError in GetCommissionErrorQuery(queryOptions.Scope)
                        select commissionError;

            //Apply filters ----------------------------------------------------------------------------------------
            if (queryOptions.CommissionStatementId.HasValue)
                query = query.Where(c => c.CommissionStatementId == queryOptions.CommissionStatementId.Value);

            if (queryOptions.HasValidFormat.HasValue)
                query = query.Where(c => c.IsFormatValid == queryOptions.HasValidFormat.Value);
            //------------------------------------------------------------------------------------------------------

            var pagedItems = new PagedItems<CommissionError>();

            //Get total items
            pagedItems.TotalItems = await query.CountAsync();

            //Ordering
            query = query.OrderBy(queryOptions.SortOptions.Column, queryOptions.SortOptions.Direction);

            //Paging
            pagedItems.Items = await query.TakePage(queryOptions.PageOptions.Number, queryOptions.PageOptions.Size).ToListAsync();

            return pagedItems;

        }

        public async Task<CommissionError> GetNextError(ScopeOptions scope, Guid commissionStatementId, bool hasValidFormat)
        {
            var query = from commissionError in GetCommissionErrorQuery(scope)
                        where commissionError.CommissionStatementId == commissionStatementId
                        && commissionError.IsFormatValid == hasValidFormat
                        select commissionError;

            return await query.FirstOrDefaultAsync();
        }

        public async Task<CommissionError> GetError(ScopeOptions scope, Guid commissionErrorId)
        {
            var query = from commissionError in GetCommissionErrorQuery(scope)
                        where commissionError.Id == commissionErrorId
                        select commissionError;

            return await query.FirstOrDefaultAsync();
        }

        public async Task<Result> ResolveFormatError(ScopeOptions scope, CommissionError error)
        {
            var validator = new ImportCommissionValidator();
            var result = validator.Validate(error.Data).GetResult();

            if (!result.Success)
                return result;

            var entity = await GetCommissionErrorEntityQuery(scope).FirstOrDefaultAsync(e => e.Id == error.Id);

            entity.IsFormatValid = true;
            entity.Data = error.Data;
            await _context.SaveChangesAsync();

            //Check if we can resove mapping
            await ResolveMappingError(scope, error);

            return result;
        }

        public async Task<Result> ResolveMappingError(ScopeOptions scope, CommissionError error)
        {
            var validator = new CommissionErrorValidator();
            var result = validator.Validate(error).GetResult();

            if (!result.Success)
                return result;

            var commission = new CommissionEdit();

            commission.PolicyId = error.PolicyId;
            commission.CommissionStatementId = error.CommissionStatementId;
            commission.CommissionTypeId = error.CommissionTypeId;
            commission.AmountIncludingVAT = Convert.ToDecimal(error.Data.AmountIncludingVAT);
            commission.VAT = Convert.ToDecimal(error.Data.VAT);
            commission.SourceData = error.Data;

            result = await _commissionService.InsertCommission(scope, commission);

            if (!result.Success)
                return result;

            await DeleteCommissionError(scope, error);

            result.Tag = commission;

            return result;
        }

        public async Task AutoResolveMappingErrors(ScopeOptions scope, Guid commissionStatementId, Guid policyId)
        {
            var policy = await _context.Policy.FindAsync(policyId);

            var organisationQuery = ScopeQuery.GetOrganisationEntityQuery(_context, scope);

            var query = from commissionError in GetCommissionErrorQuery(scope)
                        where commissionError.CommissionStatementId == commissionStatementId
                        && commissionError.IsFormatValid == true
                        select commissionError;

            var errors = await query.ToListAsync();

            foreach (var error in errors)
            {
                //JSON Query: should be included in above query
                if (!String.Equals(error.Data.PolicyNumber, policy.Number, StringComparison.OrdinalIgnoreCase))
                    continue;

                error.ClientId = policy.ClientId;
                error.PolicyId = policyId;
                await ResolveMappingError(scope, error);
            }
        }

        private async Task DeleteCommissionError(ScopeOptions scope, CommissionError error)
        {
            var entity = await GetCommissionErrorEntityQuery(scope).FirstOrDefaultAsync(e => e.Id == error.Id);

            if (entity == null)
                return;

            _context.CommissionError.Remove(entity);
            await _context.SaveChangesAsync();
        }

        private IQueryable<CommissionErrorEntity> GetCommissionErrorEntityQuery(ScopeOptions scope)
        {
            var organisationQuery = ScopeQuery.GetOrganisationEntityQuery(_context, scope);

            var query = from organisation in organisationQuery
                        join commissionStatement in _context.CommissionStatement
                            on organisation.Id equals commissionStatement.OrganisationId
                        join commissionError in _context.CommissionError
                            on commissionStatement.Id equals commissionError.CommissionStatementId
                        select commissionError;

            return query;
        }

        private IQueryable<CommissionError> GetCommissionErrorQuery(ScopeOptions scope)
        {
            var query = from entity in GetCommissionErrorEntityQuery(scope)
                        select new CommissionError()
                        {
                            Id = entity.Id,
                            CommissionStatementId = entity.CommissionStatementId,
                            CommissionTypeId = entity.CommissionTypeId,
                            Data = entity.Data,
                            ClientId = entity.ClientId,
                            PolicyId = entity.PolicyId,
                            IsFormatValid = entity.IsFormatValid
                        };

            return query;
        }

    }
}