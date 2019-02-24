using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Protocols;
using Microsoft.IdentityModel.Protocols.OpenIdConnect;
using Microsoft.IdentityModel.Tokens;
using OneAdvisor.Data;
using OneAdvisor.Data.Entities.Directory;
using OneAdvisor.Model.Commission.Interface;
using OneAdvisor.Model.Directory.Interface;
using OneAdvisor.Model.Directory.Model.Authentication;
using OneAdvisor.Model.Member.Interface;
using OneAdvisor.Service.Commission;
using OneAdvisor.Service.Directory;
using OneAdvisor.Service.Member;
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
            Services
                .AddAuthentication(options =>
                {
                    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                })
                .AddJwtBearer(config =>
                {
                    config.RequireHttpsMetadata = false;
                    config.SaveToken = true;

                    config.TokenValidationParameters = new TokenValidationParameters()
                    {
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Configuration["Auth:Jwt:Secret"])),
                        ValidateIssuer = false,
                        ValidateAudience = false,
                        RoleClaimType = ClaimTypes.Role,
                        NameClaimType = ClaimTypes.NameIdentifier
                    };
                });

            Services.Configure<JwtOptions>(Configuration.GetSection("Auth:Jwt"));
            Services.Configure<IdentityOptions>(options => options.ClaimsIdentity.RoleClaimType = ClaimTypes.Role);
        }

        public void ConfigureServices()
        {
            Services.AddHttpContextAccessor();

            //ACCOUNT
            Services.AddScoped<IAuthenticationService, AuthenticationService>();

            //DIRECTORY
            Services.AddScoped<IUserService, UserService>();
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

        public void ConfigureMapper()
        {
            Services.AddAutoMapper();
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