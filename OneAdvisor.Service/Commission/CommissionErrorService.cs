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
using OneAdvisor.Model.Directory.Model.Auth;
using OneAdvisor.Model.Directory.Model.User;
using OneAdvisor.Service.Commission.Validators;
using OneAdvisor.Service.Common.Query;

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

        public async Task<CommissionError> GetNextError(ScopeOptions scope, Guid commissionStatementId, bool hasValidFormat)
        {
            var organisationQuery = ScopeQuery.GetOrganisationEntityQuery(_context, scope);

            var query = from commissionError in GetCommissionErrorEntityQuery(scope)
                        where commissionError.CommissionStatementId == commissionStatementId
                        && commissionError.IsFormatValid == hasValidFormat
                        select new CommissionError()
                        {
                            Id = commissionError.Id,
                            CommissionStatementId = commissionError.CommissionStatementId,
                            CommissionTypeCode = commissionError.CommissionTypeCode,
                            CommissionTypeId = commissionError.CommissionTypeId,
                            Data = commissionError.Data,
                            MemberId = commissionError.MemberId,
                            PolicyId = commissionError.PolicyId,
                            PolicyNumber = commissionError.PolicyNumber,
                            IsFormatValid = commissionError.IsFormatValid
                        };

            return await query.FirstOrDefaultAsync();
        }

        public async Task<Result> ResolveFormatError(ScopeOptions scope, CommissionError error)
        {
            var importCommission = JsonConvert.DeserializeObject<ImportCommission>(error.Data);

            var validator = new ImportCommissionValidator();
            var result = validator.Validate(importCommission).GetResult();

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

            var importCommission = JsonConvert.DeserializeObject<ImportCommission>(error.Data);

            var commission = new CommissionEdit();

            commission.PolicyId = error.PolicyId;
            commission.CommissionStatementId = error.CommissionStatementId;
            commission.CommissionTypeId = error.CommissionTypeId;
            commission.AmountIncludingVAT = Convert.ToDecimal(importCommission.AmountIncludingVAT);
            commission.VAT = Convert.ToDecimal(importCommission.VAT);

            result = await _commissionService.InsertCommission(scope, commission);

            if (!result.Success)
                return result;

            await DeleteCommissionError(scope, error);

            return result;
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
    }
}