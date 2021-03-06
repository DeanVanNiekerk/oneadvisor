using System;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using OneAdvisor.Data;
using OneAdvisor.Model.Account.Model.Authentication;
using OneAdvisor.Service.Common.Query;
using OneAdvisor.Service.Common.Validation;

namespace OneAdvisor.Service
{
    public static class CustomValidators
    {
        private static readonly string DOESNT_EXIST_MESSAGE = "'{PropertyName}' does not exist.";
        private static readonly string NOT_EMPTY_MESSAGE = "'{PropertyName}' must not be empty.";

        public static IRuleBuilderOptions<T, string> MustBeValidExcelColumn<T>(this IRuleBuilder<T, string> ruleBuilder)
        {
            return ruleBuilder.Must(value =>
            {
                return Utils.IsValidExcelColumn(value);
            }
            ).WithMessage("'{PropertyName}' must be a valid column identifier");
        }

        public static IRuleBuilderOptions<T, Guid?> UserMustBeInScope<T>(this IRuleBuilder<T, Guid?> ruleBuilder, DataContext dataContext, ScopeOptions scope)
        {
            return ruleBuilder.MustAsync(async (root, userId, context) =>
            {
                if (!userId.HasValue)
                    return false;

                return await ScopeQuery.IsUserInScope(dataContext, scope, userId.Value);
            })
            .WithMessage((root, commissionSplitRuleId) =>
            {
                if (!commissionSplitRuleId.HasValue)
                    return NOT_EMPTY_MESSAGE;
                return DOESNT_EXIST_MESSAGE;
            })
            .WithName("User");
        }

        public static IRuleBuilderOptions<T, Guid> UserMustBeInScope<T>(this IRuleBuilder<T, Guid> ruleBuilder, DataContext dataContext, ScopeOptions scope)
        {
            return ruleBuilder.MustAsync(async (root, userId, context) =>
            {
                return await ScopeQuery.IsUserInScope(dataContext, scope, userId);
            })
            .WithMessage(DOESNT_EXIST_MESSAGE)
            .WithName("User");
        }

        public static IRuleBuilderOptions<T, Guid?> OrganisationMustBeInScope<T>(this IRuleBuilder<T, Guid?> ruleBuilder, DataContext dataContext, ScopeOptions scope)
        {
            return ruleBuilder.Must((root, organisationId, context) =>
            {
                if (!organisationId.HasValue)
                    return false;

                return ScopeQuery.IsOrganisationInScope(scope, organisationId.Value);
            })
            .WithMessage(DOESNT_EXIST_MESSAGE)
            .WithName("Organisation");
        }

        public static IRuleBuilderOptions<T, Guid?> BranchMustBeInScope<T>(this IRuleBuilder<T, Guid?> ruleBuilder, DataContext dataContext, ScopeOptions scope)
        {
            return ruleBuilder.MustAsync(async (root, branchId, context) =>
            {
                if (!branchId.HasValue)
                    return false;

                var branch = await ScopeQuery.GetBranchEntityQuery(dataContext, scope).FirstOrDefaultAsync(b => b.Id == branchId);

                return branch != null;
            })
            .WithMessage((root, branchId) =>
            {
                if (!branchId.HasValue)
                    return NOT_EMPTY_MESSAGE;
                return DOESNT_EXIST_MESSAGE;
            })
            .WithName("Branch");
        }

        public static IRuleBuilderOptions<T, Guid> PolicyMustBeInScope<T>(this IRuleBuilder<T, Guid> ruleBuilder, DataContext dataContext, ScopeOptions scope)
        {
            return ruleBuilder.MustAsync(async (root, policyId, context) =>
            {
                var policy = await dataContext.Policy.FindAsync(policyId);

                if (policy == null)
                    return false;

                return await ScopeQuery.IsUserInScope(dataContext, scope, policy.UserId);
            })
            .WithMessage((root, id) =>
            {
                return DOESNT_EXIST_MESSAGE;
            })
            .WithName("Policy");
        }

        public static IRuleBuilderOptions<T, Guid?> PolicyMustBeInScope<T>(this IRuleBuilder<T, Guid?> ruleBuilder, DataContext dataContext, ScopeOptions scope)
        {
            return ruleBuilder.MustAsync(async (root, policyId, context) =>
            {
                if (!policyId.HasValue)
                    return false;

                var policy = await dataContext.Policy.FindAsync(policyId);

                if (policy == null)
                    return false;

                return await ScopeQuery.IsUserInScope(dataContext, scope, policy.UserId);
            })
            .WithMessage((root, id) =>
            {
                if (!id.HasValue)
                    return NOT_EMPTY_MESSAGE;
                return DOESNT_EXIST_MESSAGE;
            })
            .WithName("Policy");
        }

        public static IRuleBuilderOptions<T, Guid?> ClientMustBeInScope<T>(this IRuleBuilder<T, Guid?> ruleBuilder, DataContext dataContext, ScopeOptions scope)
        {
            return ruleBuilder.MustAsync(async (root, clientId, context) =>
            {
                if (!clientId.HasValue)
                    return false;

                return await ScopeQuery.IsClientInOrganisation(dataContext, scope, clientId.Value);
            })
            .WithMessage((root, clientId) =>
            {
                if (!clientId.HasValue)
                    return NOT_EMPTY_MESSAGE;
                return DOESNT_EXIST_MESSAGE;
            })
            .WithName("Client");
        }

        public static IRuleBuilderOptions<T, Guid?> CommissionSplitRuleMustBeInScope<T>(this IRuleBuilder<T, Guid?> ruleBuilder, DataContext dataContext, ScopeOptions scope)
        {
            return ruleBuilder.MustAsync(async (root, commissionSplitRuleId, context) =>
            {
                if (!commissionSplitRuleId.HasValue)
                    return false;

                var rule = await dataContext.CommissionSplitRule.FindAsync(commissionSplitRuleId);

                if (rule == null)
                    return false;

                return await ScopeQuery.IsUserInScope(dataContext, scope, rule.UserId);
            })
            .WithMessage((root, commissionSplitRuleId) =>
            {
                if (!commissionSplitRuleId.HasValue)
                    return NOT_EMPTY_MESSAGE;
                return DOESNT_EXIST_MESSAGE;
            })
            .WithName("Commission Split Rule");
        }
    }
}