using System;
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
using Microsoft.Azure.Functions.Extensions.DependencyInjection;
using Microsoft.AspNetCore.Identity;
using OneAdvisor.Data.Entities.Directory;

[assembly: FunctionsStartup(typeof(OneAdvisor.Function.Startup))]
namespace OneAdvisor.Function
{
    public class Startup : FunctionsStartup
    {
        public override void Configure(IFunctionsHostBuilder builder)
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

            services.Configure<IdentityOptions>(options =>
            {
                //Lockout settings.
                options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(10);
                options.Lockout.MaxFailedAccessAttempts = 5;

                //Password settings.
                options.Password.RequireDigit = true;
                options.Password.RequireLowercase = true;
                options.Password.RequireNonAlphanumeric = true;
                options.Password.RequireUppercase = true;
                options.Password.RequiredLength = 6;
                options.Password.RequiredUniqueChars = 1;

                //SignIn settings.
                options.SignIn.RequireConfirmedEmail = true;
                options.SignIn.RequireConfirmedPhoneNumber = false;

                //User settings.
                options.User.AllowedUserNameCharacters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-._@+";
                options.User.RequireUniqueEmail = false;

            });

            //Db Context (Entity Framework)
            services.AddDbContext<DataContext>(options =>
                options.UseSqlServer(oneAdvisorDb)
                    .ConfigureWarnings(warnings => warnings.Throw(RelationalEventId.QueryClientEvaluationWarning))
            );

            services.AddIdentity<UserEntity, RoleEntity>()
                .AddEntityFrameworkStores<DataContext>()
                .AddDefaultTokenProviders();

            //Configure Entity Framework Initializer for seeding
            services.AddTransient<IDefaultDbContextInitializer, DbInitializer>();

            //STORAGE
            services.AddScoped<IFileStorageService, FileStorageService>();

            //DIRECTORY
            services.AddScoped<IUserService, UserService>();
            services.AddScoped<IRoleService, RoleService>();
            services.AddScoped<IOrganisationService, OrganisationService>();
            services.AddScoped<IBranchService, BranchService>();
            services.AddScoped<IApplicationService, ApplicationService>();
            services.AddScoped<IUseCaseService, UseCaseService>();
            services.AddScoped<IDirectoryLookupService, DirectoryLookupService>();
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