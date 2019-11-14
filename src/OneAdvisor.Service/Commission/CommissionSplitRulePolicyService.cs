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
using System.Collections.Generic;
using OneAdvisor.Model.Commission.Model.CommissionSplitRulePolicy;
using OneAdvisor.Model.Commission.Model.CommissionSplitRule;
using OneAdvisor.Model.Directory.Interface;
using OneAdvisor.Model.Directory.Model.Audit;

namespace OneAdvisor.Service.Commission
{
    public class CommissionSplitRulePolicyService : ICommissionSplitRulePolicyService
    {
        private readonly DataContext _context;
        private readonly ICommissionSplitService _commissionSplitService;
        private readonly IAuditService _auditService;

        public CommissionSplitRulePolicyService(DataContext context, ICommissionSplitService commissionSplitService, IAuditService auditService)
        {
            _context = context;
            _commissionSplitService = commissionSplitService;
            _auditService = auditService;
        }

        public async Task<PagedItems<CommissionSplitRulePolicyInfo>> GetCommissionSplitRulePolicyInfoList(CommissionSplitRulePolicyInfoQueryOptions queryOptions)
        {
            var query = GetCommissionSplitRulePolicyInfoQuery(queryOptions.Scope);

            //Apply filters ----------------------------------------------------------------------------------------
            if (queryOptions.PolicyUserId.Any())
                query = query.Where(c => queryOptions.PolicyUserId.Contains(c.PolicyUserId));

            if (queryOptions.PolicyCompanyId.Any())
                query = query.Where(c => queryOptions.PolicyCompanyId.Contains(c.PolicyCompanyId));

            if (queryOptions.PolicyClientId.Any())
                query = query.Where(c => queryOptions.PolicyClientId.Contains(c.PolicyClientId));

            if (!string.IsNullOrWhiteSpace(queryOptions.PolicyNumber))
                query = query.Where(c => EF.Functions.Like(c.PolicyNumber, queryOptions.PolicyNumber));

            if (!string.IsNullOrWhiteSpace(queryOptions.PolicyClientFirstName))
                query = query.Where(c => EF.Functions.Like(c.PolicyClientFirstName, queryOptions.PolicyClientFirstName));

            if (!string.IsNullOrWhiteSpace(queryOptions.PolicyClientLastName))
                query = query.Where(c => EF.Functions.Like(c.PolicyClientLastName, queryOptions.PolicyClientLastName));
            //------------------------------------------------------------------------------------------------------

            var pagedItems = new PagedItems<CommissionSplitRulePolicyInfo>();

            //Get total items
            pagedItems.TotalItems = await query.CountAsync();

            //Ordering
            query = query.OrderBy(queryOptions.SortOptions.Column, queryOptions.SortOptions.Direction);

            //Paging
            pagedItems.Items = await query.TakePage(queryOptions.PageOptions.Number, queryOptions.PageOptions.Size).ToListAsync();

            return pagedItems;
        }

        public async Task<PagedItems<CommissionSplitRulePolicy>> GetCommissionSplitRulePolicies(CommissionSplitRulePolicyQueryOptions queryOptions)
        {
            var query = GetCommissionSplitRulePolicyQuery(queryOptions.Scope);

            //Apply filters ----------------------------------------------------------------------------------------
            //none so far..
            //------------------------------------------------------------------------------------------------------

            var pagedItems = new PagedItems<CommissionSplitRulePolicy>();

            //Get total items
            pagedItems.TotalItems = await query.CountAsync();

            //Ordering
            query = query.OrderBy(queryOptions.SortOptions.Column, queryOptions.SortOptions.Direction);

            //Paging
            pagedItems.Items = await query.TakePage(queryOptions.PageOptions.Number, queryOptions.PageOptions.Size).ToListAsync();

            return pagedItems;
        }

        public async Task<CommissionSplitRulePolicy> GetCommissionSplitRulePolicy(ScopeOptions scope, Guid policyId)
        {
            var query = from rule in GetCommissionSplitRulePolicyQuery(scope)
                        where rule.PolicyId == policyId
                        select rule;

            var splitRulePolicy = await query.FirstOrDefaultAsync();

            if (splitRulePolicy != null)
                return splitRulePolicy;

            //See if there is a default
            var defaultRule = await GetDefaultCommissionSplitRule(scope, policyId);

            return new CommissionSplitRulePolicy()
            {
                CommissionSplitRuleId = defaultRule != null ? defaultRule.Id : null,
                PolicyId = policyId
            };
        }

        private async Task<CommissionSplitRule> GetDefaultCommissionSplitRule(ScopeOptions scope, Guid policyId)
        {
            var policy = await _context.Policy.FindAsync(policyId);

            if (policy == null)
                return null;

            var options = new CommissionSplitRuleQueryOptions(scope, "", "", 0, 0);
            options.UserId.Add(policy.UserId);
            var rules = await _commissionSplitService.GetCommissionSplitRules(options);
            return rules.Items.FirstOrDefault(r => r.IsDefault);
        }

        public async Task<Result> DeleteCommissionSplitRulePolicy(ScopeOptions scope, Guid id)
        {
            var result = new Result();

            var entity = await GetCommissionSplitRulePolicyEntityQuery(scope).FirstOrDefaultAsync(b => b.Id == id);

            if (entity == null)
                return new Result();

            _context.CommissionSplitRulePolicy.Remove(entity);

            await _context.SaveChangesAsync();

            await _auditService.InsertAuditLog(scope, AuditLog.ACTION_DELETE, "CommissionSplitRulePolicy", entity);

            return new Result(true);
        }

        public async Task<Result> InsertCommissionSplitRulePolicy(ScopeOptions scope, CommissionSplitRulePolicy commissionSplitRulePolicy)
        {
            var validator = new CommissionSplitRulePolicyValidator(_context, scope, true);
            var result = validator.Validate(commissionSplitRulePolicy).GetResult();

            if (!result.Success)
                return result;

            var defaultRule = await GetDefaultCommissionSplitRule(scope, commissionSplitRulePolicy.PolicyId.Value);

            //If the rule is already the default dont add it
            if (defaultRule != null && commissionSplitRulePolicy.CommissionSplitRuleId == defaultRule.Id)
                return result;

            var entity = MapModelToEntity(commissionSplitRulePolicy);
            await _context.CommissionSplitRulePolicy.AddAsync(entity);
            await _context.SaveChangesAsync();

            commissionSplitRulePolicy.Id = entity.Id;
            result.Tag = commissionSplitRulePolicy;

            await _auditService.InsertAuditLog(scope, AuditLog.ACTION_INSERT, "CommissionSplitRulePolicy", commissionSplitRulePolicy);

            return result;
        }

        public async Task<Result> UpdateCommissionSplitRulePolicy(ScopeOptions scope, CommissionSplitRulePolicy commissionSplitRulePolicy)
        {
            var validator = new CommissionSplitRulePolicyValidator(_context, scope, false);
            var result = validator.Validate(commissionSplitRulePolicy).GetResult();

            if (!result.Success)
                return result;

            var entity = await GetCommissionSplitRulePolicyEntityQuery(scope).FirstOrDefaultAsync(b => b.Id == commissionSplitRulePolicy.Id);

            if (entity == null)
                return new Result();

            var defaultRule = await GetDefaultCommissionSplitRule(scope, commissionSplitRulePolicy.PolicyId.Value);

            //If this is the default rule, then remove this instance
            if (defaultRule != null && commissionSplitRulePolicy.CommissionSplitRuleId == defaultRule.Id)
            {
                await DeleteCommissionSplitRulePolicy(scope, commissionSplitRulePolicy.Id.Value);
                return result;
            }

            var commissionSplitRulePolicyEntity = MapModelToEntity(commissionSplitRulePolicy, entity);

            await _context.SaveChangesAsync();

            await _auditService.InsertAuditLog(scope, AuditLog.ACTION_UPDATE, "CommissionSplitRulePolicy", commissionSplitRulePolicy);

            return result;
        }

        private IQueryable<CommissionSplitRulePolicyInfo> GetCommissionSplitRulePolicyInfoQuery(ScopeOptions scope)
        {
            var userQuery = ScopeQuery.GetUserEntityQuery(_context, scope);

            var query = from policy in _context.Policy
                        join user in userQuery
                            on policy.UserId equals user.Id
                        join client in _context.Client
                            on policy.ClientId equals client.Id

                        join commissionSplitRulePolicy in _context.CommissionSplitRulePolicy
                            on policy.Id equals commissionSplitRulePolicy.PolicyId into groupCommissionSplitRulePolicy
                        from subCommissionSplitRulePolicy in groupCommissionSplitRulePolicy.DefaultIfEmpty()

                        join commissionSplitRule in _context.CommissionSplitRule
                            on new { Key1 = policy.UserId, Key2 = true } equals new { Key1 = commissionSplitRule.UserId, Key2 = commissionSplitRule.IsDefault } into groupCommissionSplitRule
                        from subCommissionSplitRule in groupCommissionSplitRule.DefaultIfEmpty()

                        select new CommissionSplitRulePolicyInfo()
                        {
                            PolicyId = policy.Id,
                            PolicyUserId = policy.UserId,
                            PolicyCompanyId = policy.CompanyId,
                            PolicyNumber = policy.Number,
                            PolicyClientFirstName = client.FirstName,
                            PolicyClientLastName = client.LastName,
                            PolicyClientId = client.Id,
                            CommissionSplitRuleId = subCommissionSplitRulePolicy.CommissionSplitRuleId,
                            CommissionSplitRuleName = subCommissionSplitRulePolicy.CommissionSplitRule.Name,
                            DefaultCommissionSplitRuleId = subCommissionSplitRule.Id,
                            DefaultCommissionSplitRuleName = subCommissionSplitRule.Name
                        };

            return query;
        }

        private IQueryable<CommissionSplitRulePolicy> GetCommissionSplitRulePolicyQuery(ScopeOptions scope)
        {
            var query = from commissionSplitRulePolicy in GetCommissionSplitRulePolicyEntityQuery(scope)
                        select new CommissionSplitRulePolicy()
                        {
                            Id = commissionSplitRulePolicy.Id,
                            PolicyId = commissionSplitRulePolicy.PolicyId,
                            CommissionSplitRuleId = commissionSplitRulePolicy.CommissionSplitRuleId
                        };

            return query;
        }

        private IQueryable<CommissionSplitRulePolicyEntity> GetCommissionSplitRulePolicyEntityQuery(ScopeOptions scope)
        {
            var userQuery = ScopeQuery.GetUserEntityQuery(_context, scope);

            var query = from commissionSplitRulePolicy in _context.CommissionSplitRulePolicy
                        join policy in _context.Policy
                            on commissionSplitRulePolicy.PolicyId equals policy.Id
                        join user in userQuery
                            on policy.UserId equals user.Id
                        select commissionSplitRulePolicy;

            return query;
        }

        private CommissionSplitRulePolicyEntity MapModelToEntity(CommissionSplitRulePolicy model, CommissionSplitRulePolicyEntity entity = null)
        {
            if (entity == null)
                entity = new CommissionSplitRulePolicyEntity();

            entity.PolicyId = model.PolicyId.Value;
            entity.CommissionSplitRuleId = model.CommissionSplitRuleId.Value;

            return entity;
        }
    }
}