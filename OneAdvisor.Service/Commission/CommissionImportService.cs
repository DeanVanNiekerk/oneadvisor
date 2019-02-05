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

        public async Task ImportCommission(ScopeOptions scope, Guid commissionStatementId, IEnumerable<ImportCommission> importData)
        {
            //TODO: 
            //1. validate statement ownership!!!!!!!!!!!!!!!!!

            foreach (var data in importData)
            {
                //Check if commission has already been import
                if (await _commissionService.CommissionExists(scope, commissionStatementId, data.PolicyNumber))
                    continue;

                var validator = new ImportCommissionValidator();
                var result = validator.Validate(data).GetResult();

                var error = new CommissionError()
                {
                    CommissionStatementId = commissionStatementId,
                    PolicyNumber = data.PolicyNumber,
                    Data = JsonConvert.SerializeObject(data),
                    IsFormatValue = true
                };

                if (!result.Success)
                {
                    error.IsFormatValue = false;
                    await InsertCommissionError(error);
                    continue;
                }

                var policy = await _policyService.GetPolicy(scope, data.PolicyNumber);
                if (policy != null)
                {
                    error.MemberId = policy.MemberId;
                    error.PolicyId = policy.Id;
                }

                var commissionType = await _lookupService.GetCommissionType(data.CommissionTypeCode);
                if (commissionType != null)
                    error.CommissionTypeId = commissionType.Id;

                if (!error.IsValid())
                {
                    await InsertCommissionError(error);
                    continue;
                }

                var commission = new CommissionEdit()
                {
                    PolicyId = policy.Id,
                    CommissionStatementId = commissionStatementId,
                    CommissionTypeId = commissionType.Id,
                    AmountIncludingVAT = Convert.ToDecimal(data.AmountIncludingVAT),
                    VAT = Convert.ToDecimal(data.VAT)
                };

                result = await _commissionService.InsertCommission(scope, commission);
            }
        }

        private async Task InsertCommissionError(CommissionError error)
        {
            if (await CommissionErrorExists(error))
                return;

            var entity = MapModelToEntity(error);
            await _context.CommissionError.AddAsync(entity);
            await _context.SaveChangesAsync();
        }

        private async Task<bool> CommissionErrorExists(CommissionError error)
        {
            var query = from entity in _context.CommissionError
                        where entity.CommissionStatementId == error.CommissionStatementId
                        && EF.Functions.Like(entity.PolicyNumber, error.PolicyNumber)
                        select entity;

            return await query.AnyAsync();
        }

        private CommissionErrorEntity MapModelToEntity(CommissionError model, CommissionErrorEntity entity = null)
        {
            if (entity == null)
                entity = new CommissionErrorEntity();

            entity.CommissionStatementId = model.CommissionStatementId;
            entity.PolicyId = model.PolicyId;
            entity.PolicyNumber = model.PolicyNumber;
            entity.MemberId = model.MemberId;
            entity.Data = model.Data;

            return entity;
        }
    }
}