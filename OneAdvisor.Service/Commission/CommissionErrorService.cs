using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using OneAdvisor.Data;
using OneAdvisor.Data.Entities.Commission;
using OneAdvisor.Model;
using OneAdvisor.Model.Commission.Interface;
using OneAdvisor.Model.Commission.Model.Commission;
using OneAdvisor.Model.Commission.Model.CommissionError;
using OneAdvisor.Model.Common;
using OneAdvisor.Model.Account.Model.Authentication;
using OneAdvisor.Service.Commission.Validators;
using OneAdvisor.Service.Common.Query;
using System.Collections.Generic;
using OneAdvisor.Model.Client.Interface;
using OneAdvisor.Service.Client.Validators;
using OneAdvisor.Model.Client.Model.Policy;
using OneAdvisor.Model.Commission.Model.CommissionSplitRule;
using OneAdvisor.Model.Commission.Model.CommissionSplitRulePolicy;

namespace OneAdvisor.Service.Commission
{
    public class CommissionErrorService : ICommissionErrorService
    {
        private readonly DataContext _context;
        private readonly ICommissionService _commissionService;
        private readonly IClientService _clientService;
        private readonly ICommissionSplitService _commissionSplitService;
        private readonly IPolicyService _policyService;
        private readonly ICommissionSplitRulePolicyService _commissionSplitRulePolicyService;

        public CommissionErrorService(
            DataContext context,
            ICommissionService commissionService,
            IClientService clientService,
            ICommissionSplitService commissionSplitService,
            IPolicyService policyService,
            ICommissionSplitRulePolicyService commissionSplitRulePolicyService)
        {
            _context = context;
            _commissionService = commissionService;
            _clientService = clientService;
            _commissionSplitService = commissionSplitService;
            _policyService = policyService;
            _commissionSplitRulePolicyService = commissionSplitRulePolicyService;
        }

        public async Task<PagedItems<CommissionError>> GetErrors(CommissionErrorQueryOptions queryOptions)
        {
            var query = from commissionError in GetCommissionErrorQuery(queryOptions.Scope)
                        select commissionError;

            //Apply filters ----------------------------------------------------------------------------------------
            if (queryOptions.CommissionStatementId.HasValue)
                query = query.Where(c => c.CommissionStatementId == queryOptions.CommissionStatementId.Value);

            if (queryOptions.CommissionStatementYear.HasValue)
                query = query.Where(c => c.CommissionStatementYear == queryOptions.CommissionStatementYear.Value);

            if (queryOptions.CommissionStatementMonth.HasValue)
                query = query.Where(c => c.CommissionStatementMonth == queryOptions.CommissionStatementMonth.Value);
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

        public async Task<CommissionErrorEdit> GetNextError(ScopeOptions scope, Guid commissionStatementId)
        {
            var query = from commissionError in GetCommissionErrorEditQuery(scope)
                        where commissionError.CommissionStatementId == commissionStatementId
                        select commissionError;

            return await query.FirstOrDefaultAsync();
        }

        public async Task<CommissionErrorEdit> GetError(ScopeOptions scope, Guid commissionErrorId)
        {
            var query = from commissionError in GetCommissionErrorEditQuery(scope)
                        where commissionError.Id == commissionErrorId
                        select commissionError;

            return await query.FirstOrDefaultAsync();
        }

        public async Task<Result> ResolveMappingError(ScopeOptions scope, CommissionErrorEdit error)
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

            var policyQueryOptions = new PolicyQueryOptions(scope, "", "", 0, 0);
            policyQueryOptions.Id = error.PolicyId;
            var policy = (await _policyService.GetPolicies(policyQueryOptions)).Items.Single();

            var commissionSplitRulesOptions = new CommissionSplitRuleQueryOptions(scope, "", "", 0, 0);
            var commissionSplitRules = (await _commissionSplitService.GetCommissionSplitRules(commissionSplitRulesOptions)).Items.ToList();

            var commissionSplitRulePolicyQueryOptions = new CommissionSplitRulePolicyQueryOptions(scope, "", "", 0, 0);
            var commissionSplitRulePolicies = (await _commissionSplitRulePolicyService.GetCommissionSplitRulePolicies(commissionSplitRulePolicyQueryOptions)).Items.ToList();

            var commissions = _commissionSplitService.SplitCommission(commission, policy, error.Data, commissionSplitRules, commissionSplitRulePolicies);

            foreach (var c in commissions)
                result = await _commissionService.InsertCommission(scope, c);

            //Update client details (if none exist)
            try
            {
                var client = await _clientService.GetClient(scope, error.ClientId.Value);
                client.FirstName = string.IsNullOrEmpty(client.FirstName) ? error.Data.FirstName ?? "" : client.FirstName;
                client.LastName = string.IsNullOrEmpty(client.LastName) ? error.Data.FullName ?? "" : client.LastName;
                client.LastName = string.IsNullOrEmpty(client.LastName) ? error.Data.LastName ?? "" : client.LastName;
                client.Initials = string.IsNullOrEmpty(client.Initials) ? error.Data.Initials ?? "" : client.Initials;
                client.DateOfBirth = !client.DateOfBirth.HasValue ? DateTime.Parse(error.Data.DateOfBirth) : client.DateOfBirth;

                if (!string.IsNullOrEmpty(error.Data.IdNumber))
                {
                    var idNumber = new IdNumber(error.Data.IdNumber);
                    if (idNumber.IsValid)
                        client.IdNumber = string.IsNullOrEmpty(client.IdNumber) ? error.Data.IdNumber : client.IdNumber;
                    else
                        client.AlternateIdNumber = string.IsNullOrEmpty(client.AlternateIdNumber) ? error.Data.IdNumber ?? "" : client.AlternateIdNumber;
                }

                await _clientService.UpdateClient(scope, client);
            }
            catch { }

            if (!result.Success)
                return result;

            await DeleteError(scope, error.Id);

            result.Tag = commission;

            return result;
        }

        public async Task AutoResolveMappingErrors(ScopeOptions scope, Guid commissionStatementId, Guid policyId)
        {
            var policy = await _context.Policy.FindAsync(policyId);

            var organisationQuery = ScopeQuery.GetOrganisationEntityQuery(_context, scope);

            var query = from commissionError in GetCommissionErrorEditQuery(scope)
                        where commissionError.CommissionStatementId == commissionStatementId
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

        public async Task<Result> DeleteError(ScopeOptions scope, Guid commissionErrorId)
        {
            var entity = await GetCommissionErrorEntityQuery(scope).FirstOrDefaultAsync(e => e.Id == commissionErrorId);

            if (entity == null)
                return new Result();

            _context.CommissionError.Remove(entity);
            await _context.SaveChangesAsync();

            return new Result(true);
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

        private IQueryable<CommissionErrorEdit> GetCommissionErrorEditQuery(ScopeOptions scope)
        {
            var query = from entity in GetCommissionErrorEntityQuery(scope)
                        select new CommissionErrorEdit()
                        {
                            Id = entity.Id,
                            CommissionStatementId = entity.CommissionStatementId,
                            CommissionTypeId = entity.CommissionTypeId,
                            Data = entity.Data,
                            ClientId = entity.ClientId,
                            PolicyId = entity.PolicyId,
                        };

            return query;
        }

        private IQueryable<CommissionError> GetCommissionErrorQuery(ScopeOptions scope)
        {
            var query = from entity in GetCommissionErrorEntityQuery(scope)
                        join commissionStatement in _context.CommissionStatement on entity.CommissionStatementId equals commissionStatement.Id
                        join company in _context.Company on commissionStatement.CompanyId equals company.Id
                        join commissionType in _context.CommissionType on entity.CommissionTypeId equals commissionType.Id into commissionTypeGroup
                        from commissionType in commissionTypeGroup.DefaultIfEmpty()
                        join policyType in _context.PolicyType on commissionType.PolicyTypeId equals policyType.Id into policyTypeGroup
                        from policyType in policyTypeGroup.DefaultIfEmpty()
                        select new CommissionError()
                        {
                            Id = entity.Id,
                            CommissionStatementId = entity.CommissionStatementId,
                            CommissionStatementMonth = commissionStatement.DateMonth,
                            CommissionStatementYear = commissionStatement.DateYear,
                            CommissionTypeId = entity.CommissionTypeId,
                            Data = entity.Data,
                            ClientId = entity.ClientId,
                            PolicyId = entity.PolicyId,
                            PolicyTypeCode = policyType.Code,
                            CompanyId = company.Id,
                            CompanyName = company.Name
                        };

            return query;
        }

    }
}