using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using OneAdvisor.Data;
using OneAdvisor.Data.Entities.Member;
using OneAdvisor.Model;
using OneAdvisor.Model.Commission.Interface;
using OneAdvisor.Model.Commission.Model.Commission;
using OneAdvisor.Model.Commission.Model.ImportCommission;
using OneAdvisor.Model.Common;
using OneAdvisor.Model.Directory.Interface;
using OneAdvisor.Model.Directory.Model.Auth;
using OneAdvisor.Model.Member.Interface;
using OneAdvisor.Service.Commission.Validators;

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

        public async Task<Result> ImportCommission(ScopeOptions scope, ImportCommission data)
        {
            var validator = new ImportCommissionValidator();
            var result = validator.Validate(data).GetResult();

            if (!result.Success)
                return result;

            var policy = await _policyService.GetPolicy(scope, data.PolicyNumber);

            if (policy == null)
                return new Result("PolicyNumber", "No matching policy number");

            var commissionType = await _lookupService.GetCommissionType(data.CommissionTypeCode);

            if (commissionType == null)
                return new Result("CommissionTypeCode", "No matching commission type");

            var commission = new CommissionEdit()
            {
                PolicyId = policy.Id,
                AmountIncludingVAT = data.AmountIncludingVAT,
                VAT = data.VAT,
                Date = data.Date,
                CommissionTypeId = commissionType.Id
            };

            result = await _commissionService.InsertCommission(scope, commission);

            return result;
        }
    }
}