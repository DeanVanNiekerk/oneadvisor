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
            Errors = new List<string>();
            ValidationFailures = new List<ValidationFailure>();
        }

        public Result(string properyName, string errorMessage)
            : this()
        {
            AddValidationFailure(properyName, errorMessage);
        }

        public bool Success { get; set; }

        public object Tag { get; set; }

        public List<string> Errors { get; set; }
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