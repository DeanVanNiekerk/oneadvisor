using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using OneAdvisor.Data.ValueConverters;

namespace OneAdvisor.Data.Entities.Client.Mappings
{
    public class PolicyMap
    {
        public static void Map(ModelBuilder modelBuilder)
        {
            var jsonConverter = new JsonValueConverter<IEnumerable<string>>();

            modelBuilder.Entity<PolicyEntity>()
                .Property(p => p.Premium)
                .HasColumnType("Money");

            modelBuilder.Entity<PolicyEntity>()
                .Property(e => e._NumberAliases)
                .HasColumnName("NumberAliases")
                .HasDefaultValueSql("'[]'");
        }
    }
}