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
using System.Collections;
using System.Collections.Generic;
using OneAdvisor.Model.Commission.Model.CommissionSplitRulePolicy;

namespace OneAdvisor.Service.Commission
{
    public class CommissionSplitRulePolicyService : ICommissionSplitRulePolicyService
    {
        private readonly DataContext _context;

        public CommissionSplitRulePolicyService(DataContext context)
        {
            _context = context;
        }

        public async Task<PagedItems<CommissionSplitRulePolicyInfo>> GetCommissionSplitRulePolicies(CommissionSplitRulePolicyInfoQueryOptions queryOptions)
        {
            var query = GetCommissionSplitRulePolicyInfoQuery(queryOptions.Scope);

            //Apply filters ----------------------------------------------------------------------------------------
            if (queryOptions.PolicyUserId.Any())
                query = query.Where(c => queryOptions.PolicyUserId.Contains(c.PolicyUserId));

            if (queryOptions.PolicyCompanyId.Any())
                query = query.Where(c => queryOptions.PolicyCompanyId.Contains(c.PolicyCompanyId));

            if (!string.IsNullOrWhiteSpace(queryOptions.PolicyNumber))
                query = query.Where(c => EF.Functions.Like(c.PolicyNumber, queryOptions.PolicyNumber));
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

        public async Task<CommissionSplitRulePolicy> GetCommissionSplitRulePolicy(ScopeOptions scope, Guid policyId)
        {
            var query = from rule in GetCommissionSplitRulePolicyQuery(scope)
                        where rule.PolicyId == policyId
                        select rule;

            return await query.FirstOrDefaultAsync();
        }

        public async Task<Result> DeleteCommissionSplitRulePolicy(ScopeOptions scope, Guid id)
        {
            var result = new Result();

            var entity = await GetCommissionSplitRulePolicyEntityQuery(scope).FirstOrDefaultAsync(b => b.Id == id);

            if (entity == null)
                return new Result();

            _context.CommissionSplitRulePolicy.Remove(entity);

            await _context.SaveChangesAsync();

            return new Result(true);
        }

        public async Task<Result> InsertCommissionSplitRulePolicy(ScopeOptions scope, CommissionSplitRulePolicy commissionSplitRulePolicy)
        {
            var validator = new CommissionSplitRulePolicyValidator(_context, scope, true);
            var result = validator.Validate(commissionSplitRulePolicy).GetResult();

            if (!result.Success)
                return result;

            var entity = MapModelToEntity(commissionSplitRulePolicy);
            await _context.CommissionSplitRulePolicy.AddAsync(entity);
            await _context.SaveChangesAsync();

            commissionSplitRulePolicy.Id = entity.Id;
            result.Tag = commissionSplitRulePolicy;

            return result;
        }

        public async Task<Result> UpdateCommissionSplitRulePolicy(ScopeOptions scope, CommissionSplitRulePolicy commissionSplitRulePolicy)
        {
            var validator = new CommissionSplitRulePolicyValidator(_context, scope, false);
            var result = validator.Validate(commissionSplitRulePolicy).GetResult();

            if (!result.Success)
                return result;

            var entity = await _context.CommissionSplitRulePolicy.FindAsync(commissionSplitRulePolicy.Id);

            if (entity == null)
                return new Result();

            var commissionSplitRulePolicyEntity = MapModelToEntity(commissionSplitRulePolicy, entity);

            await _context.SaveChangesAsync();

            return result;
        }

        private IQueryable<CommissionSplitRulePolicyInfo> GetCommissionSplitRulePolicyInfoQuery(ScopeOptions scope)
        {
            var userQuery = ScopeQuery.GetUserEntityQuery(_context, scope);

            var query = from policy in _context.Policy
                        join user in userQuery
                            on policy.UserId equals user.Id
                        select new CommissionSplitRulePolicyInfo()
                        {
                            PolicyId = policy.Id,
                            PolicyUserId = policy.UserId,
                            PolicyCompanyId = policy.CompanyId,
                            PolicyNumber = policy.Number
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