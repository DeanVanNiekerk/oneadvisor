using Microsoft.EntityFrameworkCore;
using OneAdvisor.Data.ValueConverters;
using OneAdvisor.Model.Directory.Model.Organisation.Configuration;

namespace OneAdvisor.Data.Entities.Directory.Mappings
{
    public class OrganisationMap
    {
        public static void Map(ModelBuilder modelBuilder)
        {
            var jsonConverter = new JsonValueConverter<Config>();

            modelBuilder.Entity<OrganisationEntity>()
                .Property(e => e.Config)
                .HasConversion(jsonConverter);

            modelBuilder.Entity<OrganisationEntity>()
                .Property(u => u.Config)
                .HasDefaultValueSql("'{ }'");
        }
    }
}