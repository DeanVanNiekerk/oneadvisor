using System;
using api.App.Setup;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Hosting;

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
            serviceSetup.ConfigureBasic();
            serviceSetup.ConfigureAuthentication();
            serviceSetup.ConfigureServices();
            serviceSetup.ConfigureLogging();
            //serviceSetup.ConfigureSwagger();

            var identitySetup = new IdentitySetup(Configuration, services);
            identitySetup.Configure();

            var emailSetup = new EmailSetup(Configuration, services);
            emailSetup.Configure();

            services.AddApplicationInsightsTelemetry();
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env, ILoggerFactory loggerFactory)
        {
            //Run database migrations
            var databaseMigrate = new DatabaseMigrate(app);
            databaseMigrate.Migrate();

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseHsts();
            }

            app.UseRouting();

            // Global CORS policy
            app.UseCors(x => x
                .AllowAnyOrigin()
                .AllowAnyMethod()
                .AllowAnyHeader());

            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });

            // app.UseSwagger();
            // app.UseSwaggerUI(c =>
            // {
            //     c.SwaggerEndpoint("/swagger/v1/swagger.json", "One Advisor API");
            // });
        }
    }
}
