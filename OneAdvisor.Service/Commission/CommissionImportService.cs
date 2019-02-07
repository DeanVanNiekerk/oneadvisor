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

namespace OneAdvisor.Service.Commission
{
    public class CommissionImportService : ICommissionImportService
    {
        private readonly DataContext _context;
        private readonly IPolicyService _policyService;
        private readonly ILookupService _lookupService;
        private readonly ICommissionService _commissionService;

        public CommissionImportService(DataContext context, ICommissionService commissionService, IPolicyService policyService, ILookupService lookupService)
        {
            _context = context;
            _policyService = policyService;
            _lookupService = lookupService;
            _commissionService = commissionService;
        }

        public async Task ImportCommissions(ScopeOptions scope, Guid commissionStatementId, IEnumerable<ImportCommission> importData)
        {
            //TODO: 
            //1. validate statement ownership!!!!!!!!!!!!!!!!!

            foreach (var data in importData)
                await ImportCommission(scope, commissionStatementId, data);
        }

        public async Task<Result> ImportCommission(ScopeOptions scope, Guid commissionStatementId, ImportCommission importCommission)
        {
            var validator = new ImportCommissionValidator();
            var result = validator.Validate(importCommission).GetResult();

            var error = new CommissionError()
            {
                CommissionStatementId = commissionStatementId,
                PolicyNumber = importCommission.PolicyNumber,
                CommissionTypeCode = importCommission.CommissionTypeCode,
                Data = JsonConvert.SerializeObject(importCommission),
                IsFormatValid = true
            };

            if (!result.Success)
            {
                error.IsFormatValid = false;
                await UpdateCommissionError(error);
                return result;
            }

            var commissionType = await _lookupService.GetCommissionType(importCommission.CommissionTypeCode);
            if (commissionType != null)
                error.CommissionTypeId = commissionType.Id;

            var policy = await _policyService.GetPolicy(scope, importCommission.PolicyNumber);
            if (policy != null)
            {
                error.MemberId = policy.MemberId;
                error.PolicyId = policy.Id;
            }

            if (!error.IsValid())
            {
                await UpdateCommissionError(error);
                return new Result();
            }

            //Import data is valid, try and get an existing commission entry
            var commission = await _commissionService.GetCommission(scope, commissionStatementId, commissionType.Id.Value, importCommission.PolicyNumber);

            //Check if commission has already been imported
            if (commission == null)
            {
                commission = LoadCommissionModel(commissionStatementId, policy, commissionType, importCommission);
                result = await _commissionService.InsertCommission(scope, commission);
            }
            else
            {
                commission = LoadCommissionModel(commissionStatementId, policy, commissionType, importCommission, commission);
                result = await _commissionService.UpdateCommission(scope, commission);
            }

            //Insert/Update of the commission entry successfull, delete error record
            if (result.Success)
                await DeleteCommissionError(error);

            return result;
        }

        private async Task UpdateCommissionError(CommissionError error)
        {
            var entity = await GetCommissionError(error);

            if (entity == null)
            {
                entity = MapModelToEntity(error);
                await _context.CommissionError.AddAsync(entity);
            }
            else
            {
                entity = MapModelToEntity(error, entity);
            }

            await _context.SaveChangesAsync();
        }

        private async Task DeleteCommissionError(CommissionError error)
        {
            var entity = await GetCommissionError(error);

            if (entity != null)
            {
                _context.CommissionError.Remove(entity);
                await _context.SaveChangesAsync();
            }
        }

        private async Task<CommissionErrorEntity> GetCommissionError(CommissionError error)
        {
            var query = from entity in _context.CommissionError
                        where entity.CommissionStatementId == error.CommissionStatementId
                        && EF.Functions.Like(entity.PolicyNumber, error.PolicyNumber)
                        && EF.Functions.Like(entity.CommissionTypeCode, error.CommissionTypeCode)
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