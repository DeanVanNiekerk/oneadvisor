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
using OneAdvisor.Model.Commission.Model.CommissionSplitRule;
using OneAdvisor.Model.Commission.Model.Commission;
using OneAdvisor.Model.Client.Model.Policy;
using OneAdvisor.Model.Commission.Model.ImportCommission;
using OneAdvisor.Model.Commission.Model.CommissionSplitRulePolicy;
using OneAdvisor.Model.Directory.Interface;
using OneAdvisor.Model.Directory.Model.Audit;

namespace OneAdvisor.Service.Commission
{
    public class CommissionSplitService : ICommissionSplitService
    {
        private readonly DataContext _context;
        private readonly IAuditService _auditService;

        public CommissionSplitService(DataContext context, IAuditService auditService)
        {
            _context = context;
            _auditService = auditService;
        }

        public async Task<PagedItems<CommissionSplitRule>> GetCommissionSplitRules(CommissionSplitRuleQueryOptions queryOptions)
        {
            var query = GetCommissionSplitRuleQuery(queryOptions.Scope);

            //Apply filters ----------------------------------------------------------------------------------------
            if (queryOptions.UserId.Any())
                query = query.Where(c => queryOptions.UserId.Contains(c.UserId.Value));
            //------------------------------------------------------------------------------------------------------

            var pagedItems = new PagedItems<CommissionSplitRule>();

            //Get total items
            pagedItems.TotalItems = await query.CountAsync();

            //Ordering
            query = query.OrderBy(queryOptions.SortOptions.Column, queryOptions.SortOptions.Direction);

            //Paging
            pagedItems.Items = await query.TakePage(queryOptions.PageOptions.Number, queryOptions.PageOptions.Size).ToListAsync();

            return pagedItems;
        }

        public async Task<CommissionSplitRule> GetCommissionSplitRule(ScopeOptions scope, Guid id)
        {
            var query = from rule in GetCommissionSplitRuleQuery(scope)
                        where rule.Id == id
                        select rule;

            return await query.FirstOrDefaultAsync();
        }

        public async Task<Result> DeleteCommissionSplitRule(ScopeOptions scope, Guid id)
        {
            var result = new Result();

            var entity = await GetCommissionSplitRuleEntityQuery(scope).FirstOrDefaultAsync(b => b.Id == id);

            if (entity == null)
                return new Result();

            //Delete dependancies
            var policyRules = await _context.CommissionSplitRulePolicy.Where(r => r.CommissionSplitRuleId == id).ToListAsync();
            foreach (var policyRule in policyRules)
                _context.CommissionSplitRulePolicy.Remove(policyRule);

            _context.CommissionSplitRule.Remove(entity);

            await _context.SaveChangesAsync();

            await _auditService.InsertAuditLog(scope, AuditLog.ACTION_DELETE, "CommissionSplitRule", entity);

            return new Result(true);
        }

        public async Task<Result> InsertCommissionSplitRule(ScopeOptions scope, CommissionSplitRule commissionSplitRule)
        {
            var validator = new CommissionSplitRuleValidator(_context, scope, true);
            var result = validator.Validate(commissionSplitRule).GetResult();

            if (!result.Success)
                return result;

            if (commissionSplitRule.IsDefault)
                await ClearDefaults(commissionSplitRule.UserId.Value);

            var entity = MapModelToEntity(commissionSplitRule);
            await _context.CommissionSplitRule.AddAsync(entity);
            await _context.SaveChangesAsync();

            commissionSplitRule.Id = entity.Id;
            result.Tag = commissionSplitRule;

            await _auditService.InsertAuditLog(scope, AuditLog.ACTION_INSERT, "CommissionSplitRule", commissionSplitRule);

            return result;
        }

        public async Task<Result> UpdateCommissionSplitRule(ScopeOptions scope, CommissionSplitRule commissionSplitRule)
        {
            var validator = new CommissionSplitRuleValidator(_context, scope, false);
            var result = validator.Validate(commissionSplitRule).GetResult();

            if (!result.Success)
                return result;

            var entity = await GetCommissionSplitRuleEntityQuery(scope).FirstOrDefaultAsync(c => c.Id == commissionSplitRule.Id);

            if (entity == null)
                return new Result();

            if (commissionSplitRule.IsDefault)
                await ClearDefaults(commissionSplitRule.UserId.Value);

            var commissionSplitRuleEntity = MapModelToEntity(commissionSplitRule, entity);

            await _context.SaveChangesAsync();

            await _auditService.InsertAuditLog(scope, AuditLog.ACTION_UPDATE, "CommissionSplitRule", commissionSplitRule);

            return result;
        }

        private async Task ClearDefaults(Guid userId)
        {
            var rules = await _context.CommissionSplitRule.Where(r => r.UserId == userId).ToListAsync();

            foreach (var rule in rules)
            {
                rule.IsDefault = false;
            }

            await _context.SaveChangesAsync();
        }

        private IQueryable<CommissionSplitRule> GetCommissionSplitRuleQuery(ScopeOptions scope)
        {
            var query = from commissionSplitRule in GetCommissionSplitRuleEntityQuery(scope)
                        select new CommissionSplitRule()
                        {
                            Id = commissionSplitRule.Id,
                            UserId = commissionSplitRule.UserId,
                            Name = commissionSplitRule.Name,
                            IsDefault = commissionSplitRule.IsDefault,
                            Split = commissionSplitRule.Split
                        };

            return query;
        }

        private IQueryable<CommissionSplitRuleEntity> GetCommissionSplitRuleEntityQuery(ScopeOptions scope)
        {
            var userQuery = ScopeQuery.GetUserEntityQuery(_context, scope);

            var query = from commissionSplitRule in _context.CommissionSplitRule
                        join user in userQuery
                            on commissionSplitRule.UserId equals user.Id
                        select commissionSplitRule;

            return query;
        }

        private CommissionSplitRuleEntity MapModelToEntity(CommissionSplitRule model, CommissionSplitRuleEntity entity = null)
        {
            if (entity == null)
                entity = new CommissionSplitRuleEntity();

            entity.UserId = model.UserId.Value;
            entity.Name = model.Name;
            entity.IsDefault = model.IsDefault;
            entity.Split = model.Split;

            return entity;
        }

        public List<CommissionEdit> SplitCommission(CommissionEdit commission, Policy policy, ImportCommission sourceData, List<CommissionSplitRule> commissionSplitRules, List<CommissionSplitRulePolicy> commissionSplitRulePolicies)
        {
            var commissions = new List<CommissionEdit>();

            var splits = GetCommissionSplit(policy, commissionSplitRules, commissionSplitRulePolicies);

            var splitGroupId = splits.Count > 1 ? (Guid?)Guid.NewGuid() : null;

            foreach (var split in splits)
            {
                var c = new CommissionEdit();

                c.Id = Guid.NewGuid();
                c.PolicyId = policy.Id;
                c.UserId = split.UserId;
                c.CommissionStatementId = commission.CommissionStatementId;
                c.CommissionTypeId = commission.CommissionTypeId;
                c.AmountIncludingVAT = commission.AmountIncludingVAT * (split.Percentage / 100);
                c.VAT = commission.VAT * (split.Percentage / 100);
                c.SourceData = sourceData;
                c.SplitGroupId = splitGroupId;

                commissions.Add(c);
            }

            return commissions;
        }

        private List<CommissionSplit> GetCommissionSplit(Policy policy, List<CommissionSplitRule> commissionSplitRules, List<CommissionSplitRulePolicy> commissionSplitRulePolicies)
        {
            var split = new List<CommissionSplit>();

            //This is the default rule
            var rule = commissionSplitRules.FirstOrDefault(r => r.IsDefault && r.UserId == policy.UserId);

            //Check specific rule on policy
            var rulePolicy = commissionSplitRulePolicies.FirstOrDefault(r => r.PolicyId == policy.Id);

            //If there is a policy specific rule, use it
            if (rulePolicy != null)
                rule = commissionSplitRules.FirstOrDefault(r => r.Id == rulePolicy.CommissionSplitRuleId);

            if (rule == null)
                split.Add(new CommissionSplit() { UserId = policy.UserId, Percentage = 100 });
            else
                split.AddRange(rule.Split);

            return split;
        }

    }
}