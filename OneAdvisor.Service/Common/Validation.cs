using System;
using FluentValidation;
using FluentValidation.Results;
using FluentValidation.Validators;

namespace OneAdvisor.Service.Common
{
    public class Validation
    {
        public static void GuidNotEmpty(Guid guid, CustomContext context)
        {
            if (guid == default(Guid) || guid == null)
            {
                var failure = new ValidationFailure(context.PropertyName, $"'{context.PropertyName}' must not be empty.", "");
                context.AddFailure(failure);
            }
        }
    }
}