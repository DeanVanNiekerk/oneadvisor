using System;
using System.Collections.Generic;
using System.Linq;
using OneAdvisor.Model.Commission.Model.CommissionStatementTemplate.Configuration;

namespace OneAdvisor.Model.Commission.Model.CommissionStatementTemplate.Helpers
{
    public class MappingTemplate
    {

        public static List<string> Parse(string value)
        {
            return value.Split(CommissionTypes.COMMISSION_TYPE_SEPARATOR).ToList();
        }

        public static int ParseCount(string value)
        {
            return Parse(value).Count;
        }

        public static string Format(List<string> values)
        {
            return string.Join(CommissionTypes.COMMISSION_TYPE_SEPARATOR, values);
        }

        public static bool EqualLength(string value1, string value2)
        {
            return ParseCount(value1) == ParseCount(value2);
        }
    }
}