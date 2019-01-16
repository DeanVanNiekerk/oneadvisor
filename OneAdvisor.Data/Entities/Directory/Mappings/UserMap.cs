using System;
using Microsoft.EntityFrameworkCore;

namespace OneAdvisor.Data.Entities.Directory.Mappings
{
    public class UserMap
    {
        public static void Map(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<UserEntity>()
            .Property(e => e.Aliases)
            .HasConversion(
                v => string.Join(";", v),
                v => v.Split(";", StringSplitOptions.RemoveEmptyEntries));
        }
    }
}