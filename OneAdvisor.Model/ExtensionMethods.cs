using FluentValidation.Results;
using OneAdvisor.Model.Common;

namespace OneAdvisor.Model
{
    public static class ExtensionMethods
    {
        public static Result GetResult(this ValidationResult validationResult)
        {
            var result = new Result();
            result.LoadValidationResults(validationResult);
            return result;
        }
    }
}