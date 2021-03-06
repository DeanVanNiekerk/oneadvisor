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

        public static string GetColumn(string part)
        {
            if (IsRegex(part))
            {
                var index = part.IndexOf('[');
                return part.Substring(0, index);
            }

            if (IsSubstring(part))
            {
                var index = part.IndexOf('(');
                return part.Substring(0, index);
            }

            return part;
        }

        public static bool IsSubstring(string part)
        {
            if (IsRegex(part)) return false;

            var index = part.IndexOf('(');
            return index != -1;
        }

        public static bool IsRegex(string part)
        {
            var index = part.IndexOf('[');
            return index != -1;
        }

        public static List<int> GetSubStringIndexes(string part)
        {
            var index = part.IndexOf('(');
            if (index == -1)
                return new List<int>();

            var range = part.Substring(index + 1, part.Length - index - 2);

            var parts = range.Split('-');

            return parts.Select(p => Convert.ToInt32(p)).ToList();
        }

        public static string GetRegex(string part)
        {
            var index = part.IndexOf('[');
            if (index == -1)
                return "";

            return part.Substring(index + 1, part.Length - index - 2);
        }
    }
}