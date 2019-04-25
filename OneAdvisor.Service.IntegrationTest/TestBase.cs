using System;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.Extensions.DependencyInjection;
using OneAdvisor.Data;
using EFCore.BulkExtensions;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.Data.Sqlite;

namespace OneAdvisor.Service.IntegrationTest
{
    public abstract class TestBase : IDisposable
    {
        private List<SqliteConnection> _connections = new List<SqliteConnection>();
        private List<DataContext> _contexts = new List<DataContext>();

        /*
        First prize is to use sqlite as its in memory and quicker. 
        If sqlite has unsupported functionality like JSON_QUERY then you'll have to use the full blown sqlserver db.
         */
        protected DbContextOptions<DataContext> CreateDatabaseSqlite()
        {
            var connection = new SqliteConnection("DataSource=:memory:");
            connection.Open();

            var options = new DbContextOptionsBuilder<DataContext>()
                    .UseSqlite(connection)
                    .Options;

            using (var context = new DataContext(options))
            {
                context.Database.EnsureCreated();
            }

            return options;
        }

        protected async Task<DbContextOptions<DataContext>> CreateDatabaseSqlServer()
        {
            var serviceProvider = new ServiceCollection()
                .AddEntityFrameworkSqlServer()
                .BuildServiceProvider();

            string databaseName = $"Test_{Guid.NewGuid()}";

            var builder = new DbContextOptionsBuilder<DataContext>();

            //builder.UseSqlServer($"Server=tcp:oneadvisor-sql.database.windows.net,1433;Initial Catalog={databaseName};User ID=oneadvisor@oneadvisor-sql;Password=rob!nh00d;")
            //Uncomment for quicker local testing
            builder.UseSqlServer($"Server=127.0.0.1,1433;Database={databaseName};User ID=sa;Password=2x&%bLn3c47Y!y&hv7")
                    .ConfigureWarnings(warnings => warnings.Throw(RelationalEventId.QueryClientEvaluationWarning))
                    .UseInternalServiceProvider(serviceProvider);

            var context = new DataContext(builder.Options);

            await context.Database.MigrateAsync();

            _contexts.Add(context);

            return builder.Options;
        }

        public void Dispose()
        {
            foreach (var connection in _connections)
            {
                connection.Close();
            }

            foreach (var context in _contexts)
            {
                context.Database.EnsureDeleted();
            }
        }
    }
}