using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Protocols;
using Microsoft.IdentityModel.Protocols.OpenIdConnect;
using Microsoft.IdentityModel.Tokens;
using OneAdvisor.Model.Directory.Interface;
using OneAdvisor.Service.Directory;
using OneAdvisor.Service.Okta;
using OneAdvisor.Service.Okta.Service;

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
            Services.AddScoped<IUserService, UserService>();
            Services.AddScoped<IRoleService, RoleService>();
            Services.AddScoped<IOrganisationService, OrganisationService>();
        }

        public void ConfigureMapper(IMapper mapper)
        {
            Services.AddSingleton(typeof(IMapper), mapper);
        }
    }
}