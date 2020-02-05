using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using OneAdvisor.Data.ValueConverters;

namespace OneAdvisor.Data.Entities.Directory.Lookup.Mappings
{
    public class CompanyMap
    {
        public static void Map(ModelBuilder modelBuilder)
        {
            var jsonConverter = new JsonValueConverter<IEnumerable<string>>();

            modelBuilder.Entity<CompanyEntity>()
                .Property(e => e.CommissionPolicyNumberPrefixes)
                .HasConversion(jsonConverter)
                .HasJsonComparer();
        }
    }
}