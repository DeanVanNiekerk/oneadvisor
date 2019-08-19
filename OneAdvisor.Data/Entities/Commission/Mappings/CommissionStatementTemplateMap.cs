using System;
using Microsoft.EntityFrameworkCore;
using OneAdvisor.Data.ValueConverters;
using OneAdvisor.Model.Commission.Model.CommissionStatementTemplate.Configuration;

namespace OneAdvisor.Data.Entities.Commission.Mappings
{
    public class CommissionStatementTemplateMap
    {
        public static void Map(ModelBuilder modelBuilder)
        {
            var jsonConverter = new JsonValueConverter<Config>();

            modelBuilder.Entity<CommissionStatementTemplateEntity>()
                .Property(e => e.Config)
                .HasConversion(jsonConverter);
        }
    }
}