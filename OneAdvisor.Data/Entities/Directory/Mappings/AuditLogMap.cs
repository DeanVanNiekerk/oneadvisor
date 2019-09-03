using System;
using Microsoft.EntityFrameworkCore;
using OneAdvisor.Data.ValueConverters;

namespace OneAdvisor.Data.Entities.Directory.Mappings
{
    public class AuditLogMap
    {
        public static void Map(ModelBuilder modelBuilder)
        {
            var jsonConverter = new JsonValueConverter<dynamic>();

            modelBuilder.Entity<AuditLogEntity>()
                .Property(e => e.Data)
                .HasConversion(jsonConverter);
        }
    }
}