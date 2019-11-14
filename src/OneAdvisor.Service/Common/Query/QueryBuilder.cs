using System.Collections.Generic;
using System.Data.SqlClient;

namespace OneAdvisor.Service.Common.Query
{
    public class QueryBuilder
    {
        public QueryBuilder()
        {
            Query = string.Empty;
            SqlParameters = new List<SqlParameter>();
        }

        public string Query { get; set; }
        public List<SqlParameter> SqlParameters { get; set; }

        public void Append(string query)
        {
            Query += $@"
            {query}
            ";

        }
    }
}