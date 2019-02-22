using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Protocols;
using Microsoft.IdentityModel.Protocols.OpenIdConnect;
using Microsoft.IdentityModel.Tokens;
using OneAdvisor.Model.Commission.Interface;
using OneAdvisor.Model.Directory.Interface;
using OneAdvisor.Model.Member.Interface;
using OneAdvisor.Service.Commission;
using OneAdvisor.Service.Directory;
using OneAdvisor.Service.Member;
using OneAdvisor.Service.Okta;
using OneAdvisor.Service.Okta.Service;
using Swashbuckle.AspNetCore.Swagger;

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

        public void ConfigureCors()
        {
            Services.AddCors(options =>
            {
                options.AddPolicy("Policy", builder => builder
                    .WithOrigins(Configuration.GetValue<string>("Auth:Cors:WithOrigins"))
                    .AllowAnyMethod()
                    .AllowAnyHeader()
                    .AllowCredentials()
                );
            });

        }

        public void ConfigureAuthentication()
        {
            var okta = Configuration.GetValue<string>("Auth:Jwt:Authority");

            var configurationManager = new ConfigurationManager<OpenIdConnectConfiguration>(
                okta + "/.well-known/openid-configuration",
                new OpenIdConnectConfigurationRetriever(),
                new HttpDocumentRetriever());

            Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                    {
                        options.TokenValidationParameters = new TokenValidationParameters
                        {
                            ValidateIssuer = true,
                            ValidateAudience = false, //TODO: Fix
                            ValidateLifetime = true,
                            ValidateIssuerSigningKey = true,
                            ValidIssuer = Configuration.GetValue<string>("Auth:Jwt:Authority"),
                            //ValidAudience = Configuration.GetValue<string>("Auth:Jwt:Audience"),
                            IssuerSigningKeyResolver = (token, securityToken, identifier, parameters) =>
                                {
                                    var discoveryDocument = Task.Run(() => configurationManager.GetConfigurationAsync()).GetAwaiter().GetResult();
                                    return discoveryDocument.SigningKeys;
                                }
                        };
                    });

        }

        public void ConfigureSettings()
        {
            Services.Configure<OktaSettings>(Configuration.GetSection("Auth:Okta"));
        }

        public void ConfigureServices()
        {
            Services.AddHttpContextAccessor();

            //DIRECTORY
            Services.AddScoped<IUserServiceOkta, UserServiceOkta>();
            Services.AddScoped<IAuthService, AuthService>();
            Services.AddScoped<IRoleService, RoleService>();
            Services.AddScoped<IOrganisationService, OrganisationService>();
            Services.AddScoped<IBranchService, BranchService>();
            Services.AddScoped<IApplicationService, ApplicationService>();
            Services.AddScoped<IUseCaseService, UseCaseService>();
            Services.AddScoped<ILookupService, LookupService>();
            Services.AddScoped<IAuditService, AuditService>();

            //MEMBER
            Services.AddScoped<IMemberService, MemberService>();
            Services.AddScoped<IMemberImportService, MemberImportService>();
            Services.AddScoped<IMemberExportService, MemberExportService>();
            Services.AddScoped<IPolicyService, PolicyService>();
            Services.AddScoped<IContactService, ContactService>();

            //COMMISSION
            Services.AddScoped<ICommissionService, CommissionService>();
            Services.AddScoped<ICommissionImportService, CommissionImportService>();
            Services.AddScoped<ICommissionStatementService, CommissionStatementService>();
            Services.AddScoped<ICommissionErrorService, CommissionErrorService>();
        }

        public void ConfigureMapper(IMapper mapper)
        {
            Services.AddSingleton(typeof(IMapper), mapper);
        }

        public void ConfigureLogging()
        {
            Services.AddLogging(builder => builder.AddConsole());
        }

        public void ConfigureSwagger()
        {
            //https://github.com/domaindrivendev/Swashbuckle.AspNetCore
            Services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new Info { Title = "One Advisor", Version = "v1" });
            });
        }
    }
}