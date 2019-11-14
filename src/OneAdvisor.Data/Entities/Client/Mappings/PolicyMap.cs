using Microsoft.EntityFrameworkCore;

namespace OneAdvisor.Data.Entities.Client.Mappings
{
    public class PolicyMap
    {
        public static void Map(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<PolicyEntity>()
                .Property(p => p.Premium)
                .HasColumnType("Money");
        }
    }
}