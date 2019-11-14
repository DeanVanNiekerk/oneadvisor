using Microsoft.WindowsAzure.Storage.Table;

namespace OneAdvisor.Service.Storage
{
    public static class ExtensionMethods
    {
        public static string AndWhere(this string @this, string filter)
        {
            if (string.IsNullOrWhiteSpace(@this)) return filter;
            @this = TableQuery.CombineFilters(@this, TableOperators.And, filter);
            return @this;
        }

        public static string OrWhere(this string @this, string filter)
        {
            if (string.IsNullOrWhiteSpace(@this)) return filter;
            @this = TableQuery.CombineFilters(@this, TableOperators.Or, filter);
            return @this;
        }

        public static string NotWhere(this string @this, string filter)
        {
            if (string.IsNullOrWhiteSpace(@this)) return filter;
            @this = TableQuery.CombineFilters(@this, TableOperators.Not, filter);
            return @this;
        }
    }
}