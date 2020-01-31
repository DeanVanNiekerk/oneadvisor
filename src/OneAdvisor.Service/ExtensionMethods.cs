using System.Collections.Generic;
using System.Data;
using Microsoft.Data.SqlClient;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using OneAdvisor.Service.Common.DataReader;

namespace OneAdvisor.Service
{
    public static class ExtensionMethods
    {
        public static async Task<IEnumerable<T>> FromSqlAsync<T>(this DbContext context, string query)
        {
            return await context.FromSqlAsync<T>(query, new List<SqlParameter>());
        }

        public static async Task<IEnumerable<T>> FromSqlAsync<T>(this DbContext context, string query, SqlParameter sqlParam)
        {
            return await context.FromSqlAsync<T>(query, new List<SqlParameter>() { sqlParam });
        }

        public static async Task<IEnumerable<T>> FromSqlAsync<T>(this DbContext context, string query, List<SqlParameter> sqlParams)
        {
            using (var command = context.Database.GetDbConnection().CreateCommand())
            {
                command.CommandText = query;
                command.CommandType = CommandType.Text;

                if (sqlParams != null)
                    command.Parameters.AddRange(sqlParams.ToArray());

                await context.Database.OpenConnectionAsync();

                using (var result = await command.ExecuteReaderAsync())
                {
                    var list = new List<T>();

                    var mapper = new DataReaderMapper<T>(result);

                    while (await result.ReadAsync())
                        list.Add(mapper.MapFrom(result));

                    return list;
                }
            }
        }
    }
}