using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using OneAdvisor.Data;

namespace api
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

            //Configure Entity Framework Initializer for seeding
            Services.AddTransient<IDefaultDbContextInitializer, DbInitializer>();
        }
    }
}