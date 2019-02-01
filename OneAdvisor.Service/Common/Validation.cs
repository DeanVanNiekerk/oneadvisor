using System;
using System.Collections.Generic;
using FluentValidation;
using FluentValidation.Results;

namespace OneAdvisor.Service.Common
{
    public static class Validation
    {
        /*
        public static void NotEmpty(Guid guid, CustomContext context)
        {
            if (guid == default(Guid) || guid == null)
            {
                var failure = new ValidationFailure(context.PropertyName, $"'{context.PropertyName.Replace("Id", "")}' must not be empty.", "");
                context.AddFailure(failure);
            }
        }
      

        public static IRuleBuilderOptions<T, Guid> NotEmpty<T, Guid>(this IRuleBuilder<T, Guid> ruleBuilder, string propertyName = "")
        {
            return ruleBuilder.Custom((value, context) =>
            {
                if (value.ToString() == default(Guid).ToString() || value == null)
                {
                    propertyName = string.IsNullOrEmpty(propertyName) ? context.PropertyName : propertyName;
                    var failure = new ValidationFailure(context.PropertyName, $"'{propertyName}' must not be empty.", "");
                    context.AddFailure(failure);
                }
            }) as IRuleBuilderOptions<T, Guid>;
        }

          */

        // public static IRuleBuilderOptions<T, IList<TElement>> ListMustContainFewerThan<T, TElement>(this IRuleBuilder<T, IList<TElement>> ruleBuilder, int num) {

        //     return ruleBuilder.Custom((list, context) => {
        //         if(list.Count > 10) {
        //         context.AddFailure("The list must contain 10 items or fewer");
        //         }
        //     }) as IRuleBuilderOptions<T, IList<TElement>>;
        // }

    }
}