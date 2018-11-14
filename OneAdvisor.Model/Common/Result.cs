using System.Collections.Generic;
using FluentValidation.Results;

namespace OneAdvisor.Model.Common
{
    public class Result
    {
        public Result()
        {
            Success = false;
        }
        public bool Success { get; set; }

        public IList<ValidationFailure> ValidationFailures {get; set; }

        public void LoadValidationResults(ValidationResult result)
        {
            Success = result.IsValid;
            ValidationFailures = result.Errors;
        }
    }
}