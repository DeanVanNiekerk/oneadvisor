using Microsoft.EntityFrameworkCore;

namespace OneAdvisor.Data.Entities.Commission.Mappings
{
    public class CommissionMap
    {
        public static void Map(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<CommissionEntity>()
                .Property(p => p.AmountIncludingVAT)
                .HasColumnType("Money");

            modelBuilder.Entity<CommissionEntity>()
                .Property(p => p.VAT)
                .HasColumnType("Money");
        }
    }
}