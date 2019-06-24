using System;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Hosting;
using Microsoft.Extensions.DependencyInjection;
using OneAdvisor.Data;
using OneAdvisor.Model.Commission.Interface;
using OneAdvisor.Model.Storage.Interface;
using OneAdvisor.Service.Commission;
using OneAdvisor.Service.Storage;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using OneAdvisor.Model.Config.Options;

namespace OneAdvisor.Function
{
    public class Startup : IWebJobsStartup
    {
        public void Configure(IWebJobsBuilder builder)
        {
            ConfigureServices(builder.Services).BuildServiceProvider(true);
        }

        private IServiceCollection ConfigureServices(IServiceCollection services)
        {
            var oneAdvisorDb = Environment.GetEnvironmentVariable("OneAdvisorDb");
            var azureStorage = Environment.GetEnvironmentVariable("AzureStorage");

            //Options
            services.Configure<ConnectionOptions>((options) =>
            {
                options.OneAdvisorDb = oneAdvisorDb;
                options.AzureStorage = azureStorage;
            });

            //Db Context (Entity Framework)
            services.AddDbContext<DataContext>(options =>
                options.UseSqlServer(oneAdvisorDb)
                    .ConfigureWarnings(warnings => warnings.Throw(RelationalEventId.QueryClientEvaluationWarning))
            );

            //STORAGE
            services.AddScoped<IFileStorageService, FileStorageService>();

            //COMMISSION
            services.AddScoped<ICommissionImportService, CommissionImportService>();
            services.AddScoped<ICommissionStatementService, CommissionStatementService>();


            return services;
        }
    }
}