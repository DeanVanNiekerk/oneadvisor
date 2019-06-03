using System;
using System.Collections.Generic;
using System.Text.RegularExpressions;
using FluentValidation;
using FluentValidation.Results;
using FluentValidation.Validators;
using OneAdvisor.Data;
using OneAdvisor.Model.Account.Model.Authentication;
using OneAdvisor.Service.Common.Query;
using OneAdvisor.Service.Common.Validation;

namespace OneAdvisor.Service
{
    public static class CustomValidators
    {
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
            .WithMessage("User does not exist");
        }

        public static IRuleBuilderOptions<T, Guid> UserMustBeInScope<T>(this IRuleBuilder<T, Guid> ruleBuilder, DataContext dataContext, ScopeOptions scope)
        {
            return ruleBuilder.MustAsync(async (root, userId, context) =>
            {
                return await ScopeQuery.IsUserInScope(dataContext, scope, userId);
            })
            .WithMessage("User does not exist");
        }
    }
}