using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using OneAdvisor.Model.Common;

namespace OneAdvisor.Model.Common
{
    public abstract class QueryOptionsBase
    {
        public QueryOptionsBase(string sortColumn, string sortDirection, int pageSize, int pageNumber, string filters = null)
        {
            SortOptions = new SortOptions(sortColumn, sortDirection);
            PageOptions = new PageOptions(pageSize, pageNumber);
            Filters = GetFilters(filters);
        }

        public SortOptions SortOptions { get; private set; }
        public PageOptions PageOptions { get; private set; }
        public List<Filter> Filters { get; set; }

        private List<Filter> GetFilters(string rawData)
        {
            var filters = new List<Filter>();

            if (string.IsNullOrWhiteSpace(rawData))
                return filters;

            var parts = rawData.Split(';');

            foreach (var part in parts)
            {
                var filterParts = rawData.Split('=');

                if (filterParts.Length != 2)
                    continue;

                filters.Add(new Filter()
                {
                    FieldName = filterParts.First(),
                    Value = filterParts.Last()
                });
            }

            return filters;
        }

        protected FilterParseResult<T> GetFilterValue<T>(string fieldName)
        {
            var result = new FilterParseResult<T>();
            var filter = Filters.FirstOrDefault(f => f.FieldName.ToLower() == fieldName.ToLower());

            if (filter == null)
                return result;

            try
            {
                result.Value = (T)TypeDescriptor.GetConverter(typeof(T)).ConvertFromInvariantString(filter.Value);
                result.Success = true;

                return result;
            }
            catch (NotSupportedException)
            {
                return result;
            }
        }

    }


}