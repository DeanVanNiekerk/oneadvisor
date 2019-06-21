using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.App.Authorization;
using api.App.Setup;
using Audit.Core;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using OneAdvisor.Data;
using OneAdvisor.Data.Entities.Directory;

namespace api
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        public void ConfigureServices(IServiceCollection services)
        {
            //Set up database
            var databaseSetup = new DatabaseSetup(Configuration, services);
            databaseSetup.Configure();

            //Confirgure services (DI)
            var serviceSetup = new ServiceSetup(Configuration, services);
            serviceSetup.ConfigureCors();
            serviceSetup.ConfigureHealthCheck();
            serviceSetup.ConfigureAuthentication();
            serviceSetup.ConfigureServices();
            serviceSetup.ConfigureLogging();
            serviceSetup.ConfigureSwagger();

            var identitySetup = new IdentitySetup(Configuration, services);
            identitySetup.Configure();

            var auditSetup = new AuditSetup(services);
            auditSetup.Setup();

            var emailSetup = new EmailSetup(Configuration, services);
            emailSetup.Configure();

            services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_2);
        }

        public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
        {
            //Run database migrations
            var databaseMigrate = new DatabaseMigrate(app);
            databaseMigrate.Migrate();

            app.UseCors("Policy");

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseHsts();
            }

            app.UseHealthCheck();
            app.UseMaintainCorsHeader();
            app.UseHttpsRedirection();
            app.UseAuthentication();

            app.UseSwagger();
            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "One Advisor API");
            });

            app.UseMvc();
        }
    }
}
