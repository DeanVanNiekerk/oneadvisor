using System;
using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;
using Newtonsoft.Json;
using OneAdvisor.Data;
using OneAdvisor.Data.Entities.Commission;
using OneAdvisor.Data.Entities.Member;
using OneAdvisor.Model;
using OneAdvisor.Model.Commission.Interface;
using OneAdvisor.Model.Commission.Model.Commission;
using OneAdvisor.Model.Commission.Model.CommissionError;
using OneAdvisor.Model.Commission.Model.ImportCommission;
using OneAdvisor.Model.Common;
using OneAdvisor.Model.Directory.Interface;
using OneAdvisor.Model.Directory.Model.Auth;
using OneAdvisor.Model.Member.Interface;
using OneAdvisor.Service.Commission.Validators;
using Microsoft.EntityFrameworkCore;
using OneAdvisor.Model.Member.Model.Policy;
using OneAdvisor.Model.Directory.Model.Lookup;
using OneAdvisor.Model.Commission.Model.CommissionStatement;

namespace OneAdvisor.Service.Commission
{
    public class CommissionImportService : ICommissionImportService
    {
        private readonly DataContext _context;
        private readonly IPolicyService _policyService;
        private readonly ILookupService _lookupService;
        private readonly ICommissionService _commissionService;
        private readonly ICommissionStatementService _commissionStatementService;

        public CommissionImportService(DataContext context, ICommissionStatementService commissionStatementService, ICommissionService commissionService, IPolicyService policyService, ILookupService lookupService)
        {
            _context = context;
            _policyService = policyService;
            _lookupService = lookupService;
            _commissionService = commissionService;
            _commissionStatementService = commissionStatementService;
        }

        public async Task<List<Result>> ImportCommissions(ScopeOptions scope, Guid commissionStatementId, IEnumerable<ImportCommission> importData)
        {
            var results = new List<Result>();

            //Scope check
            var queryOptions = new CommissionStatementQueryOptions(scope, "", "", 0, 0, $"commissionStatementId={commissionStatementId}");
            var statements = await _commissionStatementService.GetCommissionStatements(queryOptions);
            if (!statements.Items.Any())
                return results;

            foreach (var data in importData)
            {
                var result = await ImportCommission(scope, statements.Items.Single(), data);
                results.Add(result);
            }

            return results;
        }

        public async Task<Result> ImportCommission(ScopeOptions scope, CommissionStatement commissionStatement, ImportCommission importCommission)
        {
            var validator = new ImportCommissionValidator();
            var result = validator.Validate(importCommission).GetResult();

            var error = new CommissionError()
            {
                CommissionStatementId = commissionStatement.Id,
                PolicyNumber = importCommission.PolicyNumber,
                CommissionTypeCode = importCommission.CommissionTypeCode,
                Data = JsonConvert.SerializeObject(importCommission),
                IsFormatValid = true
            };

            if (!result.Success)
            {
                error.IsFormatValid = false;
                await InsertCommissionError(error);
                return result;
            }

            var commissionType = await _lookupService.GetCommissionType(importCommission.CommissionTypeCode);
            if (commissionType != null)
                error.CommissionTypeId = commissionType.Id;

            var policy = await _policyService.GetPolicy(scope, commissionStatement.CompanyId, importCommission.PolicyNumber);
            if (policy != null)
            {
                error.MemberId = policy.MemberId;
                error.PolicyId = policy.Id;
            }

            if (!error.IsValid())
            {
                await InsertCommissionError(error);
                return new Result();
            }

            //Import data is valid, try and get an existing commission entry
            var commission = LoadCommissionModel(commissionStatement.Id, policy, commissionType, importCommission);

            return await _commissionService.InsertCommission(scope, commission);
        }

        private async Task InsertCommissionError(CommissionError error)
        {
            var entity = MapModelToEntity(error);
            await _context.CommissionError.AddAsync(entity);
            await _context.SaveChangesAsync();
        }

        private async Task<CommissionErrorEntity> GetCommissionError(CommissionError error)
        {
            var query = from entity in _context.CommissionError
                        where entity.CommissionStatementId == error.CommissionStatementId
                        && entity.Id == error.Id
                        select entity;

            return await query.FirstOrDefaultAsync();
        }

        private CommissionErrorEntity MapModelToEntity(CommissionError model, CommissionErrorEntity entity = null)
        {
            if (entity == null)
                entity = new CommissionErrorEntity();

            entity.CommissionStatementId = model.CommissionStatementId;
            entity.PolicyId = model.PolicyId;
            entity.PolicyNumber = model.PolicyNumber;
            entity.CommissionTypeId = model.CommissionTypeId;
            entity.CommissionTypeCode = model.CommissionTypeCode;
            entity.MemberId = model.MemberId;
            entity.IsFormatValid = model.IsFormatValid;
            entity.Data = model.Data;

            return entity;
        }

        private CommissionEdit LoadCommissionModel(Guid commissionStatementId, PolicyEdit policy, CommissionType commissionType, ImportCommission importCommission, CommissionEdit commission = null)
        {
            if (commission == null)
                commission = new CommissionEdit();

            commission.PolicyId = policy.Id;
            commission.CommissionStatementId = commissionStatementId;
            commission.CommissionTypeId = commissionType.Id;
            commission.AmountIncludingVAT = Convert.ToDecimal(importCommission.AmountIncludingVAT);
            commission.VAT = Convert.ToDecimal(importCommission.VAT);

            return commission;
        }
    }
}