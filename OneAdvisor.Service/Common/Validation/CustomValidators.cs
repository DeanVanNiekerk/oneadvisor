using System.Text.RegularExpressions;
using FluentValidation;
using FluentValidation.Results;
using FluentValidation.Validators;
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
    }
}