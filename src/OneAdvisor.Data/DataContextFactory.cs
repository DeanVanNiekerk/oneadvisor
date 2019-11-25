

using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.EntityFrameworkCore.Migrations;
using OneAdvisor.Data.Extensions;

namespace OneAdvisor.Data
{
    public class DataContextFactory : IDesignTimeDbContextFactory<DataContext>
    {
        public DataContext CreateDbContext(string[] args)
        {
            //This is the connection string used for local updates
            var optionsBuilder = new DbContextOptionsBuilder<DataContext>();
            optionsBuilder.UseSqlServer(Environment.GetEnvironmentVariable("OA_OneAdvisorDb"));

            optionsBuilder.ReplaceService<IMigrationsAnnotationProvider, ExtendedSqlServerMigrationsAnnotationProvider>();
            optionsBuilder.ReplaceService<IMigrationsSqlGenerator, ExtendedSqlServerMigrationsSqlGenerator>();

            return new DataContext(optionsBuilder.Options);
        }
    }
}