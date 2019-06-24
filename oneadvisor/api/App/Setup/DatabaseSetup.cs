using System;
using Audit.EntityFramework;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using OneAdvisor.Data;
using OneAdvisor.Data.Entities.Directory;

namespace api.App.Setup
{
    public class DatabaseSetup
    {
        public DatabaseSetup(IConfiguration configuration, IServiceCollection services)
        {
            Configuration = configuration;
            Services = services;
        }

        private IServiceCollection Services { get; }
        public IConfiguration Configuration { get; }

        public void Configure()
        {
            //Db Context (Entity Framework)
            Services.AddDbContext<DataContext>(options =>
                options.UseSqlServer(Configuration.GetConnectionString("OneAdvisorDb"))
                    .ConfigureWarnings(warnings => warnings.Throw(RelationalEventId.QueryClientEvaluationWarning))
            );

            //Services.AddDbContext<AuditDbContext>();

            Services.AddIdentity<UserEntity, RoleEntity>()
                .AddEntityFrameworkStores<DataContext>()
                .AddDefaultTokenProviders();

            //Configure Entity Framework Initializer for seeding
            Services.AddTransient<IDefaultDbContextInitializer, DbInitializer>();
        }
    }
}