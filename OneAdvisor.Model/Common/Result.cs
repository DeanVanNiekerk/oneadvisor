using System.Collections.Generic;
using FluentValidation.Results;

namespace OneAdvisor.Model.Common
{
    public class Result
    {
        public Result()
            : this(false)
        { }

        public Result(bool success)
        {
            Success = success;
            ValidationFailures = new List<ValidationFailure>();
        }

        public bool Success { get; set; }

        public object Tag { get; set; }

        public IList<ValidationFailure> ValidationFailures { get; set; }

        public void LoadValidationResults(ValidationResult result)
        {
            Success = result.IsValid;
            ValidationFailures = result.Errors;
        }

        public void AddValidationFailure(string properyName, string errorMessage)
        {
            Success = false;
            ValidationFailures.Add(new ValidationFailure(properyName, errorMessage));
        }
    }
}