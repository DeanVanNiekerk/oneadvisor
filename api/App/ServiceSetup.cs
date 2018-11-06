using AutoMapper;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using OneAdvisor.Model.Directory.Interface.Repository;
using OneAdvisor.Model.Directory.Interface.Service;
using OneAdvisor.Repository.Okta;
using OneAdvisor.Repository.Okta.Repository;
using OneAdvisor.Service.Directory;

namespace api
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
            Services.AddAuthentication(sharedOptions =>
            {
                sharedOptions.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                sharedOptions.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                options.Authority = Configuration.GetValue<string>("Auth:Jwt:Authority");
                options.Audience = Configuration.GetValue<string>("Auth:Jwt:Audience");
            });
        }

        public void ConfigureSettings()
        {
            Services.Configure<OktaSettings>(Configuration.GetSection("Auth:Okta"));
        }

        public void ConfigureRepositories()
        {
            Services.AddScoped<IUserRepository, UserRepository>();
        }

        public void ConfigureServices()
        {
            Services.AddScoped<IUserService, UserService>();
        }

        public void ConfigureMapper(IMapper mapper)
        {
            Services.AddSingleton(typeof(IMapper), mapper);
        }
    }
}