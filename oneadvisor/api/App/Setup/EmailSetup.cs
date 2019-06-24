using System;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace api.App.Setup
{
    public class EmailSetup
    {
        public EmailSetup(IConfiguration configuration, IServiceCollection services)
        {
            Configuration = configuration;
            Services = services;
        }

        private IServiceCollection Services { get; }
        public IConfiguration Configuration { get; }

        public void Configure()
        {
            Services
                .AddFluentEmail(Configuration.GetValue<string>("Email:DefaultFromAddress"))
                .AddRazorRenderer()
                .AddSendGridSender(Configuration.GetValue<string>("Email:SendGridApiKey"));
        }
    }
}