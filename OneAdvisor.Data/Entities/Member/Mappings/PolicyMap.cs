using Microsoft.EntityFrameworkCore;

namespace OneAdvisor.Data.Entities.Member.Mappings
{
    public class PolicyMap
    {
        public static void Map(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<PolicyEntity>()
                .HasIndex(m => new { m.CompanyId, m.Number })
                .IsUnique();
        }
    }
}