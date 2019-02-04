using Microsoft.EntityFrameworkCore;

namespace OneAdvisor.Data.Entities.Commission.Mappings
{
    public class CommissionStatementMap
    {
        public static void Map(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<CommissionStatementEntity>()
                .Property(p => p.AmountIncludingVAT)
                .HasColumnType("Money");

            modelBuilder.Entity<CommissionStatementEntity>()
                .Property(p => p.VAT)
                .HasColumnType("Money");
        }
    }
}