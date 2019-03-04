using Microsoft.EntityFrameworkCore;
using OneAdvisor.Data.ValueConverters;
using OneAdvisor.Model.Commission.Model.ImportCommission;

namespace OneAdvisor.Data.Entities.Commission.Mappings
{
    public class CommissionMap
    {
        public static void Map(ModelBuilder modelBuilder)
        {
            var jsonConverter = new JsonValueConverter<ImportCommission>();

            modelBuilder.Entity<CommissionEntity>()
                .Property(p => p.AmountIncludingVAT)
                .HasColumnType("Money");

            modelBuilder.Entity<CommissionEntity>()
                .Property(p => p.VAT)
                .HasColumnType("Money");

            modelBuilder.Entity<CommissionEntity>()
                .Property(e => e.SourceData)
                .HasConversion(jsonConverter);
        }
    }
}