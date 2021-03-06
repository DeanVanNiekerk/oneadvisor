using System;
using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;
using OneAdvisor.Data;
using OneAdvisor.Data.Entities.Commission;
using OneAdvisor.Model;
using OneAdvisor.Model.Commission.Interface;
using OneAdvisor.Model.Commission.Model.Commission;
using OneAdvisor.Model.Commission.Model.ImportCommission;
using OneAdvisor.Model.Common;
using OneAdvisor.Model.Directory.Interface;
using OneAdvisor.Model.Account.Model.Authentication;
using OneAdvisor.Model.Client.Interface;
using OneAdvisor.Service.Commission.Validators;
using OneAdvisor.Model.Client.Model.Policy;
using OneAdvisor.Model.Commission.Model.CommissionStatement;
using OneAdvisor.Service.Common.BulkActions;
using OneAdvisor.Model.Commission.Model.Lookup;
using OneAdvisor.Model.Commission.Model.CommissionSplitRule;
using OneAdvisor.Model.Commission.Model.CommissionSplitRulePolicy;

namespace OneAdvisor.Service.Commission
{
    public class CommissionImportService : ICommissionImportService
    {
        private readonly DataContext _context;
        private readonly IPolicyService _policyService;
        private readonly IDirectoryLookupService _lookupService;
        private readonly IBulkActions _bulkActions;
        private readonly ICommissionStatementService _commissionStatementService;
        private readonly ICommissionLookupService _commissionLookupService;
        private readonly ICommissionSplitService _commissionSplitService;
        private readonly ICommissionSplitRulePolicyService _commissionSplitRulePolicyService;
        private readonly IAuditService _auditService;

        public CommissionImportService(
            DataContext context,
            IBulkActions bulkActions,
            ICommissionStatementService commissionStatementService,
            IPolicyService policyService,
            IDirectoryLookupService lookupService,
            ICommissionLookupService commissionLookupService,
            ICommissionSplitService commissionSplitService,
            ICommissionSplitRulePolicyService commissionSplitRulePolicyService,
            IAuditService auditService)
        {
            _context = context;
            _policyService = policyService;
            _lookupService = lookupService;
            _commissionStatementService = commissionStatementService;
            _bulkActions = bulkActions;
            _commissionLookupService = commissionLookupService;
            _commissionSplitService = commissionSplitService;
            _commissionSplitRulePolicyService = commissionSplitRulePolicyService;
            _auditService = auditService;
        }

        private List<CommissionEntity> CommissionsToInsert { get; set; }
        private List<CommissionErrorEntity> CommissionErrorsToInsert { get; set; }

        public async Task<ImportResult> ImportCommissions(ScopeOptions scope, Guid commissionStatementId, IEnumerable<ImportCommission> importData)
        {
            var importResult = new ImportResult();

            CommissionsToInsert = new List<CommissionEntity>();
            CommissionErrorsToInsert = new List<CommissionErrorEntity>();

            //Scope check
            var queryOptions = new CommissionStatementQueryOptions(scope, "", "", 0, 0);
            queryOptions.CommissionStatementId = commissionStatementId;
            var statements = await _commissionStatementService.GetCommissionStatements(queryOptions);
            if (!statements.Items.Any())
                return importResult;

            var statement = statements.Items.Single();

            var commissionTypes = await _commissionLookupService.GetCommissionTypes();
            var commissionTypesDictionary = BuildCommissionTypesDictionary(commissionTypes);
            var company = await _lookupService.GetCompany(statement.CompanyId);

            var policyQueryOptions = new PolicyQueryOptions(scope, "", "", 0, 0);
            policyQueryOptions.CompanyId.Add(statement.CompanyId);
            var policies = (await _policyService.GetPolicies(policyQueryOptions)).Items.ToList();
            var policyDictionary = BuildPolicyDictionary(policies, company.CommissionPolicyNumberPrefixes.ToList());

            var commissionSplitRulesQueryOptions = new CommissionSplitRuleQueryOptions(scope, "", "", 0, 0);
            var commissionSplitRules = (await _commissionSplitService.GetCommissionSplitRules(commissionSplitRulesQueryOptions)).Items.ToList();

            var commissionSplitRulePolicyQueryOptions = new CommissionSplitRulePolicyQueryOptions(scope, "", "", 0, 0);
            var commissionSplitRulePolicies = (await _commissionSplitRulePolicyService.GetCommissionSplitRulePolicies(commissionSplitRulePolicyQueryOptions)).Items.ToList();

            foreach (var data in importData)
            {
                var result = ImportCommission(scope, statement, data, policyDictionary, commissionTypesDictionary, commissionSplitRules, commissionSplitRulePolicies);

                importResult.Results.Add(result);

                if (data.CommissionTypeCode == CommissionType.COMMISSION_TYPE_UNKNOWN_CODE)
                    importResult.AddUnknownCommissionTypeValue(data.CommissionTypeValue);
            }

            if (CommissionsToInsert.Any())
                await _bulkActions.BulkInsertCommissionsAsync(_context, CommissionsToInsert);

            if (CommissionErrorsToInsert.Any())
                await _bulkActions.BulkInsertCommissionErrorsAsync(_context, CommissionErrorsToInsert);

            await _auditService.InsertAuditLog(scope, "Import", "Commission", statement.Id,
                new
                {
                    commissionStatementId = commissionStatementId,
                    importCount = importResult.ImportCount,
                    errorCount = importResult.ErrorCount,
                    errors = importResult.Results.Where(r => !r.Success).ToList()
                }
            );

            return importResult;
        }

        private Result ImportCommission(
            ScopeOptions scope,
            CommissionStatement commissionStatement,
            ImportCommission importCommission,
            Dictionary<string, Policy> policies,
            Dictionary<string, CommissionType> commissionTypes,
            List<CommissionSplitRule> commissionSplitRules,
            List<CommissionSplitRulePolicy> commissionSplitRulePolicies)
        {
            var validator = new ImportCommissionValidator();
            var result = validator.Validate(importCommission).GetResult();

            if (!result.Success)
                return result;

            //Cleanup
            importCommission.PolicyNumber = importCommission.PolicyNumber.TrimWhiteSpace(); ;

            var error = new CommissionErrorEntity()
            {
                Id = Guid.NewGuid(),
                CommissionStatementId = commissionStatement.Id,
                Data = importCommission,
            };

            CommissionType commissionType = null;
            var commissionTypeKey = importCommission.CommissionTypeCode.ToLowerInvariant();
            if (commissionTypes.ContainsKey(commissionTypeKey))
            {
                commissionType = commissionTypes[commissionTypeKey];
                error.CommissionTypeId = commissionType.Id;
            }

            Policy policy = null;
            var policyNumberKey = importCommission.PolicyNumber.ToLowerInvariant();
            if (policies.ContainsKey(policyNumberKey))
                policy = policies[policyNumberKey];

            if (policy != null)
            {
                error.ClientId = policy.ClientId;
                error.PolicyId = policy.Id;
            }

            if (!IsCommissionErrorValid(error))
            {
                CommissionErrorsToInsert.Add(error);
                return new Result(true);
            }

            var commission = LoadCommissionEdit(commissionStatement.Id, policy, commissionType, importCommission);

            var commissionsSplit = _commissionSplitService.SplitCommission(commission, policy, importCommission, commissionSplitRules, commissionSplitRulePolicies);

            CommissionsToInsert.AddRange(commissionsSplit.Select(c => MapCommissionToEntity(c)));

            return new Result(true);
        }

        public bool IsCommissionErrorValid(CommissionErrorEntity entity)
        {
            return entity.PolicyId.HasValue && entity.ClientId.HasValue && entity.CommissionTypeId.HasValue;
        }

        private CommissionEdit LoadCommissionEdit(Guid commissionStatementId, Policy policy, CommissionType commissionType, ImportCommission importCommission)
        {
            var commission = new CommissionEdit();

            commission.Id = Guid.NewGuid();
            commission.PolicyId = policy.Id;
            commission.UserId = policy.UserId;
            commission.CommissionStatementId = commissionStatementId;
            commission.CommissionTypeId = commissionType.Id.Value;
            commission.AmountIncludingVAT = Convert.ToDecimal(importCommission.AmountIncludingVAT);
            commission.VAT = Convert.ToDecimal(importCommission.VAT);
            commission.SourceData = importCommission;

            return commission;
        }

        private CommissionEntity MapCommissionToEntity(CommissionEdit commission)
        {
            var c = new CommissionEntity();

            c.Id = commission.Id.Value;
            c.PolicyId = commission.PolicyId.Value;
            c.UserId = commission.UserId.Value;
            c.CommissionStatementId = commission.CommissionStatementId.Value;
            c.CommissionTypeId = commission.CommissionTypeId.Value;
            c.AmountIncludingVAT = commission.AmountIncludingVAT.Value;
            c.VAT = commission.VAT.Value;
            c.SourceData = commission.SourceData;
            c.SplitGroupId = commission.SplitGroupId;

            return c;
        }

        private Dictionary<string, CommissionType> BuildCommissionTypesDictionary(List<CommissionType> commissionTypes)
        {
            return commissionTypes.ToDictionary(t => t.Code.ToLowerInvariant(), t => t);
        }

        private Dictionary<string, Policy> BuildPolicyDictionary(List<Policy> policies, List<string> prefixes)
        {
            var dictionary = new Dictionary<string, Policy>();

            prefixes.Insert(0, ""); //Default, no prefix case

            foreach (var policy in policies)
            {
                var policyNumbers = new List<string>() { policy.Number };
                policyNumbers.AddRange(policy.NumberAliases);

                foreach (var number in policyNumbers)
                {
                    foreach (var prefix in prefixes)
                    {
                        var key = $"{prefix}{number}".ToLowerInvariant();
                        if (!dictionary.ContainsKey(key))
                            dictionary.Add(key, policy);
                    }
                }
            }

            return dictionary;
        }
    }
}