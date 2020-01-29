using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using OneAdvisor.Data;

namespace api.App.Setup
{
    public class DatabaseMigrate
    {
        public DatabaseMigrate(IApplicationBuilder builder)
        {
            Builder = builder;
        }

        private IApplicationBuilder Builder { get; }

        public void Migrate()
        {
            using (var serviceScope = Builder.ApplicationServices
                .GetRequiredService<IServiceScopeFactory>()
                .CreateScope())
            {
                using (var context = serviceScope.ServiceProvider.GetService<DataContext>())
                {
                    context.Database.Migrate();
                }
            }
        }
    }
}