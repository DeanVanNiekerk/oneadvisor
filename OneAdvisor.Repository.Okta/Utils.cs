using System;
using System.Collections.Generic;
using System.Linq;

namespace OneAdvisor.Repository.Okta.Repository
{
    public class Utils
    {
        public static DateTime? ParseDate(string date)
        {
            if(string.IsNullOrWhiteSpace(date))
                return null;

            return DateTime.Parse(date);
        }
    }
}