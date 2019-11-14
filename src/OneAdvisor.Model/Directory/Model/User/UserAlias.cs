using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;

namespace OneAdvisor.Model.Directory.Model.User
{
    public class UserAlias
    {
        public const string SEPARATOR = ";";

        public static string Format(IEnumerable<string> aliases)
        {
            var cleaned = aliases.Select(a => a.Replace(SEPARATOR, ""));
            return string.Join(SEPARATOR, cleaned);
        }

        public static IEnumerable<string> Parse(string aliases)
        {
            return aliases.Split(SEPARATOR, StringSplitOptions.RemoveEmptyEntries);
        }
    }
}