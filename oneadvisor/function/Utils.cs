using System.Collections.Generic;
using FluentValidation.Results;
using Microsoft.AspNetCore.Mvc;

namespace function
{
    public class Utils
    {
        public static BadRequestObjectResult GetBadRequestObject(string message, string attemptedValue = null)
        {
            return new BadRequestObjectResult(new List<ValidationFailure>() { new ValidationFailure("", message, attemptedValue) });
        }
    }
}