using System.Linq;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using OneAdvisor.Email;
using OneAdvisor.Model.Account.Interface;
using OneAdvisor.Model.Commission.Interface;
using OneAdvisor.Model.Directory.Interface;
using OneAdvisor.Model.Email;
using OneAdvisor.Model.Client.Interface;
using OneAdvisor.Service.Account;
using OneAdvisor.Service.Commission;
using OneAdvisor.Service.Common.BulkActions;
using OneAdvisor.Service.Directory;
using OneAdvisor.Service.Client;
using OneAdvisor.Model.Config.Options;
using OneAdvisor.Model.Storage.Interface;
using OneAdvisor.Service.Storage;
using OneAdvisor.Model.Account.Model.Authentication;

namespace api.App.Setup
{
    public class ServiceSetup
    {
        public ServiceSetup(IConfiguration configuration, IServiceCollection services)
        {
            Configuration = configuration;
            Services = services;
        }

        private IServiceCollection Services { get; }
        public IConfiguration Configuration { get; }

        public void ConfigureBasic()
        {
            Services.AddCors();
            Services.AddControllers();
            Services.AddHealthChecks();
        }

        public void ConfigureAuthentication()
        {
            Services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(config =>
            {
                config.RequireHttpsMetadata = false;
                config.SaveToken = true;
                config.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Configuration["Auth:Jwt:Secret"])),
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    RoleClaimType = Claims.RolesClaimName,
                    NameClaimType = ClaimTypes.NameIdentifier
                };
            });

            Services.Configure<JwtOptions>(Configuration.GetSection("Auth:Jwt"));
            Services.Configure<AppOptions>(Configuration.GetSection("App"));
            Services.Configure<ConnectionOptions>(Configuration.GetSection("ConnectionStrings"));
            Services.Configure<EmailOptions>(Configuration.GetSection("Email"));

            Services.Configure<IdentityOptions>(options => options.ClaimsIdentity.RoleClaimType = Claims.RolesClaimName);
        }

        public void ConfigureServices()
        {
            Services.AddHttpContextAccessor();

            //EMAIL
            Services.AddScoped<IEmailService, EmailService>();

            //ACCOUNT
            Services.AddScoped<IAuthenticationService, AuthenticationService>();

            //STORAGE
            Services.AddScoped<IFileStorageService, FileStorageService>();

            //DIRECTORY
            Services.AddScoped<IUserService, UserService>();
            Services.AddScoped<IRoleService, RoleService>();
            Services.AddScoped<IOrganisationService, OrganisationService>();
            Services.AddScoped<IBranchService, BranchService>();
            Services.AddScoped<IApplicationService, ApplicationService>();
            Services.AddScoped<IUseCaseService, UseCaseService>();
            Services.AddScoped<IDirectoryLookupService, DirectoryLookupService>();
            Services.AddScoped<IAuditService, OneAdvisor.Service.Storage.AuditService>();
            Services.AddScoped<IChangeLogService, ChangeLogService>();
            Services.AddScoped<ITelemetryService, TelemetryService>();

            //CLIENT
            Services.AddScoped<IClientService, ClientService>();
            Services.AddScoped<IClientImportService, ClientImportService>();
            Services.AddScoped<IClientExportService, ClientExportService>();
            Services.AddScoped<IPolicyService, PolicyService>();
            Services.AddScoped<IContactService, ContactService>();
            Services.AddScoped<IClientLookupService, ClientLookupService>();

            //COMMISSION
            Services.AddScoped<ICommissionService, CommissionService>();
            Services.AddScoped<ICommissionLookupService, CommissionLookupService>();
            Services.AddScoped<ICommissionImportService, CommissionImportService>();
            Services.AddScoped<ICommissionStatementService, CommissionStatementService>();
            Services.AddScoped<ICommissionErrorService, CommissionErrorService>();
            Services.AddScoped<ICommissionStatementTemplateService, CommissionStatementTemplateService>();
            Services.AddScoped<ICommissionReportService, CommissionReportService>();
            Services.AddScoped<ICommissionAllocationService, CommissionAllocationService>();
            Services.AddScoped<ICommissionSplitService, CommissionSplitService>();
            Services.AddScoped<ICommissionSplitRulePolicyService, CommissionSplitRulePolicyService>();

            //Helpers
            Services.AddScoped<IBulkActions, BulkActions>();
        }

        public void ConfigureLogging()
        {
            Services.AddLogging(builder => builder.AddConsole());
        }
    }
}