using System;
using System.Text.RegularExpressions;

namespace OneAdvisor.Service.Common.Validation
{
    public class MustRules
    {
        public static bool BeDecimal(string value)
        {
            decimal output;
            return decimal.TryParse(value, out output);
        }

        public static bool BeNullableDate(string value)
        {
            if (string.IsNullOrEmpty(value))
                return true;

            DateTime output;
            return DateTime.TryParse(value, out output);
        }


    }
}