using System;
using System.Linq;
using FluentValidation;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using OneAdvisor.Data;
using OneAdvisor.Data.Entities.Client;
using OneAdvisor.Model;
using OneAdvisor.Model.Common;
using OneAdvisor.Model.Account.Model.Authentication;
using OneAdvisor.Model.Client.Interface;
using OneAdvisor.Model.Client.Model.Policy;
using OneAdvisor.Model.Client.Model.Policy.Merge;
using OneAdvisor.Service.Common.Query;
using OneAdvisor.Service.Client.Validators;
using OneAdvisor.Model.Directory.Interface;
using OneAdvisor.Model.Directory.Model.Audit;
using OneAdvisor.Service.Client.Query;

namespace OneAdvisor.Service.Client
{
    public class PolicyService : IPolicyService
    {
        private readonly DataContext _context;
        private readonly IAuditService _auditService;

        public PolicyService(DataContext context, IAuditService auditService)
        {
            _context = context;
            _auditService = auditService;
        }

        public async Task<PagedItems<Policy>> GetPolicies(PolicyQueryOptions queryOptions)
        {
            var userQuery = ScopeQuery.GetUserEntityQuery(_context, queryOptions.Scope);

            var policyQuery = from policy in _context.Policy
                              select policy;

            //Apply filters ----------------------------------------------------------------------------------------
            if (!string.IsNullOrWhiteSpace(queryOptions.Number))
                policyQuery = policyQuery.WherePolicyNumberEquals(queryOptions.Number);
            //------------------------------------------------------------------------------------------------------

            var query = from user in userQuery
                        join policy in policyQuery
                            on user.Id equals policy.UserId
                        join client in _context.Client
                            on policy.ClientId equals client.Id
                        join company in _context.Company
                            on policy.CompanyId equals company.Id
                        select new Policy()
                        {
                            Id = policy.Id,
                            ClientId = policy.ClientId,
                            Number = policy.Number,
                            CompanyId = policy.CompanyId,
                            UserId = policy.UserId,
                            Premium = policy.Premium,
                            StartDate = policy.StartDate,
                            PolicyTypeId = policy.PolicyTypeId,
                            PolicyProductTypeId = policy.PolicyProductTypeId,
                            PolicyProductId = policy.PolicyProductId,
                            ClientLastName = client.LastName,
                            ClientInitials = client.Initials,
                            ClientDateOfBirth = client.DateOfBirth,
                            IsActive = policy.IsActive,
                            NumberAliases = policy.NumberAliases,
                            CompanyName = company.Name,
                        };

            //Apply filters ----------------------------------------------------------------------------------------
            if (queryOptions.Id.HasValue)
                query = query.Where(m => m.Id == queryOptions.Id.Value);

            if (queryOptions.ClientId.HasValue)
                query = query.Where(m => m.ClientId == queryOptions.ClientId.Value);

            if (queryOptions.CompanyId.Any())
                query = query.Where(m => queryOptions.CompanyId.Contains(m.CompanyId));

            if (queryOptions.PolicyTypeId.Any())
                query = query.Where(m => queryOptions.PolicyTypeId.Contains(m.PolicyTypeId.Value));

            if (queryOptions.UserId.Any())
                query = query.Where(m => queryOptions.UserId.Contains(m.UserId));

            if (!string.IsNullOrWhiteSpace(queryOptions.ClientLastName))
                query = query.Where(m => EF.Functions.Like(m.ClientLastName, queryOptions.ClientLastName));

            if (queryOptions.IsActive.HasValue)
                query = query.Where(m => m.IsActive == queryOptions.IsActive.Value);
            //------------------------------------------------------------------------------------------------------

            var pagedItems = new PagedItems<Policy>();

            //Get total items
            pagedItems.TotalItems = await query.CountAsync();

            //Ordering
            query = query.OrderBy(queryOptions.SortOptions.Column, queryOptions.SortOptions.Direction);

            //Paging
            pagedItems.Items = await query.TakePage(queryOptions.PageOptions.Number, queryOptions.PageOptions.Size).ToListAsync();

            return pagedItems;
        }

        public Task<PolicyEdit> GetPolicy(ScopeOptions scope, Guid id)
        {
            var query = from policy in GetPolicyEntityQuery(scope)
                        where policy.Id == id
                        select policy;

            return query.FirstOrDefaultAsync().MapToEditModel();
        }

        public Task<PolicyEdit> GetPolicy(ScopeOptions scope, string number)
        {
            var query = from policy in GetPolicyEntityQuery(scope)
                        select policy;

            query = query.WherePolicyNumberEquals(number);
            return query.FirstOrDefaultAsync().MapToEditModel();
        }

        public Task<PolicyEdit> GetPolicy(ScopeOptions scope, Guid companyId, string number)
        {
            var query = from policy in GetPolicyEntityQuery(scope)
                        where policy.CompanyId == companyId
                        select policy;

            query = query.WherePolicyNumberEquals(number);
            return query.FirstOrDefaultAsync().MapToEditModel();
        }

        public Task<PolicyEdit> GetPolicy(ScopeOptions scope, Guid clientId, Guid companyId, string number)
        {
            var query = from policy in GetPolicyEntityQuery(scope)
                        where policy.ClientId == clientId
                        && policy.CompanyId == companyId
                        select policy;

            query = query.WherePolicyNumberEquals(number);
            return query.FirstOrDefaultAsync().MapToEditModel();
        }

        public async Task<Result> InsertPolicy(ScopeOptions scope, PolicyEdit policy)
        {
            var validator = new PolicyValidator(_context, scope, true);
            var result = validator.Validate(policy, ruleSet: "default,availability").GetResult();

            if (!result.Success)
                return result;

            var entity = MapModelToEntity(policy);
            await _context.Policy.AddAsync(entity);
            await _context.SaveChangesAsync();

            policy.Id = entity.Id;
            result.Tag = policy;

            await _auditService.InsertAuditLog(scope, AuditLog.ACTION_INSERT, "Policy", entity.Id, policy);

            return result;
        }

        public async Task<Result> UpdatePolicy(ScopeOptions scope, PolicyEdit policy)
        {
            var validator = new PolicyValidator(_context, scope, false);
            var result = validator.Validate(policy, ruleSet: "default,availability").GetResult();

            if (!result.Success)
                return result;

            var entity = await GetPolicyEntityQuery(scope).FirstOrDefaultAsync(p => p.Id == policy.Id);

            if (entity == null)
                return new Result();

            var clientEntity = MapModelToEntity(policy, entity);

            await _context.SaveChangesAsync();

            await _auditService.InsertAuditLog(scope, AuditLog.ACTION_UPDATE, "Policy", entity.Id, policy);

            return result;
        }

        private IQueryable<PolicyEntity> GetPolicyEntityQuery(ScopeOptions scope)
        {
            var userQuery = ScopeQuery.GetUserEntityQuery(_context, scope);

            var query = from user in userQuery
                        join policy in _context.Policy
                            on user.Id equals policy.UserId
                        select policy;

            return query;
        }

        public async Task<Result> MergePolicies(ScopeOptions scope, MergePolicies merge)
        {
            var clientValidator = new PolicyValidator(_context, scope, true);
            var result = clientValidator.Validate(merge.TargetPolicy, ruleSet: "default").GetResult();

            if (!result.Success)
                return result;

            var mergeValidator = new MergePoliciesValidator(_context, scope);
            result = mergeValidator.Validate(merge).GetResult();

            if (!result.Success)
                return result;

            using (var transaction = _context.Database.BeginTransaction())
            {
                try
                {
                    //Insert the 'new' policy
                    var entity = MapModelToEntity(merge.TargetPolicy);
                    await _context.Policy.AddAsync(entity);
                    await _context.SaveChangesAsync();

                    merge.TargetPolicy.Id = entity.Id;

                    //Move dependancies to the new policy ----------------------------------------------------

                    //1. Commissions
                    var commmissions = await _context.Commission.Where(p => merge.SourcePolicyIds.Contains(p.PolicyId)).ToListAsync();
                    foreach (var commmission in commmissions)
                        commmission.PolicyId = merge.TargetPolicy.Id.Value;

                    //2. Commission Errors
                    var commissionErrors = await _context.CommissionError.Where(c => merge.SourcePolicyIds.Contains(c.PolicyId.Value)).ToListAsync();
                    foreach (var commissionError in commissionErrors)
                        commissionError.PolicyId = merge.TargetPolicy.Id.Value;

                    //3. Commission Split Rule Policies
                    var commissionSplitRulePolicies = await _context.CommissionSplitRulePolicy.Where(c => merge.SourcePolicyIds.Contains(c.PolicyId)).ToListAsync();
                    foreach (var commissionSplitRulePolicy in commissionSplitRulePolicies)
                        commissionSplitRulePolicy.PolicyId = merge.TargetPolicy.Id.Value;

                    //4. Commission Allocation Policies
                    var commissionAllocationPolicies = await _context.CommissionAllocationPolicy.Where(c => merge.SourcePolicyIds.Contains(c.PolicyId)).ToListAsync();
                    foreach (var commissionAllocationPolicy in commissionAllocationPolicies)
                        commissionAllocationPolicy.PolicyId = merge.TargetPolicy.Id.Value;

                    //----------------------------------------------------------------------------------------

                    //Delete 'old' policies
                    var policiesToDelete = await _context.Policy.Where(m => merge.SourcePolicyIds.Contains(m.Id)).ToListAsync();
                    foreach (var policyToDelete in policiesToDelete)
                        _context.Remove(policyToDelete);

                    //Check that the supplied policy numbers are available
                    result = clientValidator.Validate(merge.TargetPolicy, ruleSet: "availability").GetResult();
                    if (!result.Success)
                    {
                        transaction.Rollback();
                        return result;
                    }

                    await _context.SaveChangesAsync();
                    await transaction.CommitAsync();
                }
                catch (Exception exception)
                {
                    transaction.Rollback();
                    throw exception;
                }
            }

            result.Tag = merge.TargetPolicy;

            await _auditService.InsertAuditLog(scope, "Merge", "Policy", merge.TargetPolicy.Id, merge);

            return result;
        }

        private PolicyEntity MapModelToEntity(PolicyEdit model, PolicyEntity entity = null)
        {
            if (entity == null)
                entity = new PolicyEntity();

            entity.ClientId = model.ClientId.Value;
            entity.Number = model.Number.TrimWhiteSpace(); ;
            entity.CompanyId = model.CompanyId.Value;
            entity.UserId = model.UserId.Value;
            entity.StartDate = model.StartDate;
            entity.Premium = model.Premium;
            entity.PolicyTypeId = model.PolicyTypeId;
            entity.PolicyProductTypeId = model.PolicyProductTypeId;
            entity.PolicyProductId = model.PolicyProductId;
            entity.IsActive = model.IsActive;
            entity.NumberAliases = model.NumberAliases;

            return entity;
        }

    }
}