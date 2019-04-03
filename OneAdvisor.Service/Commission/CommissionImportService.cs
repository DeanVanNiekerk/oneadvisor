using System;
using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;
using Newtonsoft.Json;
using OneAdvisor.Data;
using OneAdvisor.Data.Entities.Commission;
using OneAdvisor.Data.Entities.Client;
using OneAdvisor.Model;
using OneAdvisor.Model.Commission.Interface;
using OneAdvisor.Model.Commission.Model.Commission;
using OneAdvisor.Model.Commission.Model.CommissionError;
using OneAdvisor.Model.Commission.Model.ImportCommission;
using OneAdvisor.Model.Common;
using OneAdvisor.Model.Directory.Interface;
using OneAdvisor.Model.Account.Model.Authentication;
using OneAdvisor.Model.Client.Interface;
using OneAdvisor.Service.Commission.Validators;
using Microsoft.EntityFrameworkCore;
using OneAdvisor.Model.Client.Model.Policy;
using OneAdvisor.Model.Directory.Model.Lookup;
using OneAdvisor.Model.Commission.Model.CommissionStatement;
using EFCore.BulkExtensions;
using OneAdvisor.Service.Common.BulkActions;
using OneAdvisor.Model.Commission.Model.Lookup;

namespace OneAdvisor.Service.Commission
{
    public class CommissionImportService : ICommissionImportService
    {
        private readonly DataContext _context;
        private readonly IPolicyService _policyService;
        private readonly ILookupService _lookupService;
        private readonly IBulkActions _bulkActions;
        private readonly ICommissionStatementService _commissionStatementService;
        private readonly ICommissionLookupService _commissionLookupService;

        public CommissionImportService(DataContext context, IBulkActions bulkActions, ICommissionStatementService commissionStatementService, IPolicyService policyService, ILookupService lookupService, ICommissionLookupService commissionLookupService)
        {
            _context = context;
            _policyService = policyService;
            _lookupService = lookupService;
            _commissionStatementService = commissionStatementService;
            _bulkActions = bulkActions;
            _commissionLookupService = commissionLookupService;
        }

        private List<CommissionEntity> CommissionsToInsert { get; set; }
        private List<CommissionErrorEntity> CommissionErrorsToInsert { get; set; }

        public async Task<List<Result>> ImportCommissions(ScopeOptions scope, Guid commissionStatementId, IEnumerable<ImportCommission> importData)
        {
            var results = new List<Result>();

            CommissionsToInsert = new List<CommissionEntity>();
            CommissionErrorsToInsert = new List<CommissionErrorEntity>();

            //Scope check
            var queryOptions = new CommissionStatementQueryOptions(scope, "", "", 0, 0);
            queryOptions.CommissionStatementId = commissionStatementId;
            var statements = await _commissionStatementService.GetCommissionStatements(queryOptions);
            if (!statements.Items.Any())
                return results;

            var statement = statements.Items.Single();

            var commissionTypes = await _commissionLookupService.GetCommissionTypes();
            var company = await _lookupService.GetCompany(statement.CompanyId);

            var policyQueryOptions = new PolicyQueryOptions(scope, "", "", 0, 0);
            policyQueryOptions.CompanyId.Add(statement.CompanyId);
            var policies = (await _policyService.GetPolicies(policyQueryOptions)).Items.ToList();

            foreach (var data in importData)
            {
                var result = ImportCommission(scope, statement, data, policies, commissionTypes, company);
                results.Add(result);
            }

            if (CommissionsToInsert.Any())
                await _bulkActions.BulkInsertCommissionsAsync(_context, CommissionsToInsert);

            if (CommissionErrorsToInsert.Any())
                await _bulkActions.BulkInsertCommissionErrorsAsync(_context, CommissionErrorsToInsert);

            return results;
        }

        private Result ImportCommission(ScopeOptions scope, CommissionStatement commissionStatement, ImportCommission importCommission, List<Policy> policies, List<CommissionType> commissionTypes, Company company)
        {
            var validator = new ImportCommissionValidator();
            var result = validator.Validate(importCommission).GetResult();

            //Cleanup
            importCommission.PolicyNumber = importCommission.PolicyNumber.Replace(" ", "");

            var error = new CommissionErrorEntity()
            {
                Id = Guid.NewGuid(),
                CommissionStatementId = commissionStatement.Id,
                Data = importCommission,
                IsFormatValid = true
            };

            var commissionType = commissionTypes.FirstOrDefault(c => c.Code.ToLower() == importCommission.CommissionTypeCode.ToLower());
            if (commissionType != null)
                error.CommissionTypeId = commissionType.Id;

            var prefixes = company.CommissionPolicyNumberPrefixes.ToList();
            prefixes.Insert(0, ""); //Add empty prefix for the default case

            var policy = policies.FirstOrDefault(p => prefixes.Any(prefix => importCommission.PolicyNumber.IgnoreCaseEquals($"{prefix}{p.Number}")));
            if (policy != null)
            {
                error.ClientId = policy.ClientId;
                error.PolicyId = policy.Id;
            }

            if (!result.Success)
            {
                error.IsFormatValid = false;
                CommissionErrorsToInsert.Add(error);
                return result;
            }

            if (!IsCommissionErrorValid(error))
            {
                CommissionErrorsToInsert.Add(error);
                return new Result();
            }

            var commission = LoadCommissionEntity(commissionStatement.Id, policy, commissionType, importCommission);

            CommissionsToInsert.Add(commission);

            return new Result(true);
        }

        public bool IsCommissionErrorValid(CommissionErrorEntity entity)
        {
            return entity.PolicyId.HasValue && entity.ClientId.HasValue && entity.CommissionTypeId.HasValue;
        }

        private CommissionEntity LoadCommissionEntity(Guid commissionStatementId, Policy policy, CommissionType commissionType, ImportCommission importCommission)
        {
            var commission = new CommissionEntity();

            commission.Id = Guid.NewGuid();
            commission.PolicyId = policy.Id;
            commission.CommissionStatementId = commissionStatementId;
            commission.CommissionTypeId = commissionType.Id.Value;
            commission.AmountIncludingVAT = Convert.ToDecimal(importCommission.AmountIncludingVAT);
            commission.VAT = Convert.ToDecimal(importCommission.VAT);
            commission.SourceData = importCommission;

            return commission;
        }

        public async Task BigDataLoader(Guid commissionStatementId, int totalRecords)
        {
            var commissionStatement = _context.CommissionStatement.Find(commissionStatementId);

            var policies = (from policy in _context.Policy
                            join client in _context.Client
                                on policy.ClientId equals client.Id
                            where client.OrganisationId == commissionStatement.OrganisationId
                            select policy.Id).ToList();
            var policyCount = policies.Count;

            var commissionTypes = (from commissionType in _context.CommissionType
                                   select commissionType.Id).ToList();
            var commissionTypeCount = commissionTypes.Count;

            var items = new List<CommissionEntity>();

            var random = new Random();

            for (int i = 0; i < totalRecords; i++)
            {
                var commission = new CommissionEntity();

                commission.Id = Guid.NewGuid();
                commission.PolicyId = policies[random.Next(0, policyCount)];
                commission.CommissionStatementId = commissionStatementId;
                commission.CommissionTypeId = commissionTypes[random.Next(0, commissionTypeCount)];
                commission.AmountIncludingVAT = Convert.ToDecimal(random.Next(40, 100));
                commission.VAT = Convert.ToDecimal(random.Next(5, 20));
                commission.SourceData = null;

                items.Add(commission);
            }

            await _bulkActions.BulkInsertCommissionsAsync(_context, items);

        }
    }
}