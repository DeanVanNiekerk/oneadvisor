using System;
using Microsoft.EntityFrameworkCore;

namespace OneAdvisor.Data.Entities.Directory.Mappings
{
    public class ChangeLogMap
    {
        public static void Map(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<ChangeLogEntity>()
                .Property(u => u.Published)
                .HasDefaultValueSql($"0");
        }
    }
}