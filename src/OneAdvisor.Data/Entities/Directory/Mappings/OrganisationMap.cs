using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using OneAdvisor.Data.ValueConverters;
using OneAdvisor.Model.Directory.Model.Organisation.Configuration;

namespace OneAdvisor.Data.Entities.Directory.Mappings
{
    public class OrganisationMap
    {
        public static void Map(ModelBuilder modelBuilder)
        {
            var jsonConfigConverter = new JsonValueConverter<Config>();
            var jsonListConverter = new JsonValueConverter<IEnumerable<Guid>>();

            modelBuilder.Entity<OrganisationEntity>()
                .Property(e => e.Config)
                .HasConversion(jsonConfigConverter)
                .HasDefaultValueSql("'{ }'");

            modelBuilder.Entity<OrganisationEntity>()
                .Property(u => u.ApplicationIds)
                .HasConversion(jsonListConverter)
                .HasDefaultValueSql("'[]'");
        }
    }
}