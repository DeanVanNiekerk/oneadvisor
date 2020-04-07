using System;
using Microsoft.EntityFrameworkCore;

namespace OneAdvisor.Data.Entities.Directory.Lookup.Mappings
{
    public class AdviceServiceMap
    {
        public static void Map(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<AdviceServiceEntity>()
                .Property(e => e.DisplayOrder)
                .HasDefaultValue(0);
        }
    }
}