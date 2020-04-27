using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using OneAdvisor.Data.ValueConverters;
using OneAdvisor.Model.Client.Model.Lookup;

namespace OneAdvisor.Data.Entities.Client.Lookup.Mappings
{
    public class PolicyProductTypeMap
    {
        public static void Map(ModelBuilder modelBuilder)
        {
            var jsonListStringConverter = new JsonValueConverter<IEnumerable<PolicyTypeCharacteristicDescription>>();

            modelBuilder.Entity<PolicyProductTypeEntity>()
                .Property(e => e.PolicyTypeCharacteristics)
                .HasConversion(jsonListStringConverter)
                .HasJsonComparer()
                .HasDefaultValueSql("'[]'"); ;
        }
    }
}