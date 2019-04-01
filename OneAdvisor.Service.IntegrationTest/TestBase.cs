using System;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.Extensions.DependencyInjection;
using OneAdvisor.Data;
using EFCore.BulkExtensions;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace OneAdvisor.Service.IntegrationTest
{
    public abstract class TestBase : IDisposable
    {
        private List<DataContext> _contexts = new List<DataContext>();

        protected async Task<DbContextOptions<DataContext>> CreateDatabase()
        {
            var serviceProvider = new ServiceCollection()
                .AddEntityFrameworkSqlServer()
                .BuildServiceProvider();

            string databaseName = $"Test_{Guid.NewGuid()}";

            var builder = new DbContextOptionsBuilder<DataContext>();

            builder.UseSqlServer($"Server=tcp:oneadvisor-sql.database.windows.net,1433;Initial Catalog={databaseName};User ID=oneadvisor@oneadvisor-sql;Password=rob!nh00d;")
            //builder.UseSqlServer($"Server=127.0.0.1,1433;Database={databaseName};User ID=sa;Password=2x&%bLn3c47Y!y&hv7")
                    .ConfigureWarnings(warnings => warnings.Throw(RelationalEventId.QueryClientEvaluationWarning))
                    .UseInternalServiceProvider(serviceProvider);

            var context = new DataContext(builder.Options);

            await context.Database.MigrateAsync();

            _contexts.Add(context);

            return builder.Options;
        }

        public void Dispose()
        {
            foreach (var context in _contexts)
            {
                context.Database.EnsureDeleted();
            }
        }
    }
}