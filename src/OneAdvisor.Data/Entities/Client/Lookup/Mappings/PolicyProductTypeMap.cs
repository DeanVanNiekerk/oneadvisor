using Microsoft.EntityFrameworkCore;

namespace OneAdvisor.Data.Entities.Client.Lookup.Mappings
{
    public class PolicyProductTypeMap
    {
        public static void Map(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<PolicyProductTypeEntity>()
             .Property(e => e._PolicyTypeCharacteristics)
             .HasColumnName("PolicyTypeCharacteristics");
            // .HasDefaultValueSql("'[]'");
        }
    }
}