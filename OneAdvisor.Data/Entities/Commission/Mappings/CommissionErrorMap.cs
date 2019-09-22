using System;
using Microsoft.EntityFrameworkCore;
using OneAdvisor.Data.ValueConverters;
using OneAdvisor.Model.Commission.Model.ImportCommission;

namespace OneAdvisor.Data.Entities.Commission.Mappings
{
    public class CommissionErrorMap
    {
        public static void Map(ModelBuilder modelBuilder)
        {
            var jsonConverter = new JsonValueConverter<ImportCommission>();

            modelBuilder.Entity<CommissionErrorEntity>()
                .Property(e => e.Data)
                .HasConversion(jsonConverter);
        }
    }
}