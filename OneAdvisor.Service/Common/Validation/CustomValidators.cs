using System.Text.RegularExpressions;
using FluentValidation;
using FluentValidation.Results;
using FluentValidation.Validators;

namespace OneAdvisor.Service
{
    public static class CustomValidators
    {
        public static IRuleBuilderOptions<T, string> MustBeValidExcelColumn<T>(this IRuleBuilder<T, string> ruleBuilder)
        {
            return ruleBuilder.Must(value =>
            {
                var regex = new Regex(@"\w{1,3}");
                var matches = regex.Matches(value);
                return matches.Count == 1;
            }
            ).WithMessage("'{PropertyName}' must be a valid column identifier");
        }
    }
}