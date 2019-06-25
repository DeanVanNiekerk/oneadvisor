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
using OneAdvisor.Service.Common.BulkActions;
using OneAdvisor.Model.Directory.Interface;
using OneAdvisor.Model.Client.Interface;
using OneAdvisor.Service.Client;
using OneAdvisor.Service.Directory;

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

            //DIRECTORY
            services.AddScoped<IUserService, UserService>();
            services.AddScoped<IRoleService, RoleService>();
            services.AddScoped<IOrganisationService, OrganisationService>();
            services.AddScoped<IBranchService, BranchService>();
            services.AddScoped<IApplicationService, ApplicationService>();
            services.AddScoped<IUseCaseService, UseCaseService>();
            services.AddScoped<ILookupService, LookupService>();
            services.AddScoped<IAuditService, AuditService>();

            //CLIENT
            services.AddScoped<IClientService, ClientService>();
            services.AddScoped<IClientImportService, ClientImportService>();
            services.AddScoped<IClientExportService, ClientExportService>();
            services.AddScoped<IPolicyService, PolicyService>();
            services.AddScoped<IContactService, ContactService>();
            services.AddScoped<IClientLookupService, ClientLookupService>();

            //COMMISSION
            services.AddScoped<ICommissionService, CommissionService>();
            services.AddScoped<ICommissionLookupService, CommissionLookupService>();
            services.AddScoped<ICommissionImportService, CommissionImportService>();
            services.AddScoped<ICommissionStatementService, CommissionStatementService>();
            services.AddScoped<ICommissionErrorService, CommissionErrorService>();
            services.AddScoped<ICommissionStatementTemplateService, CommissionStatementTemplateService>();
            services.AddScoped<ICommissionReportService, CommissionReportService>();
            services.AddScoped<ICommissionAllocationService, CommissionAllocationService>();
            services.AddScoped<ICommissionSplitService, CommissionSplitService>();
            services.AddScoped<ICommissionSplitRulePolicyService, CommissionSplitRulePolicyService>();

            //Helpers
            services.AddScoped<IBulkActions, BulkActions>();

            return services;
        }
    }
}