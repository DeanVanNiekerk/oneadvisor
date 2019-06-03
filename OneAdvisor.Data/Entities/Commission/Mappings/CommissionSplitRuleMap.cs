using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using OneAdvisor.Data.ValueConverters;
using OneAdvisor.Model.Commission.Model.CommissionSplitRule;

namespace OneAdvisor.Data.Entities.Commission.Mappings
{
    public class CommissionSplitRuleMap
    {
        public static void Map(ModelBuilder modelBuilder)
        {
            var jsonConverter = new JsonValueConverter<List<CommissionSplit>>();

            modelBuilder.Entity<CommissionSplitRuleEntity>()
                .Property(c => c.Split)
                .HasConversion(jsonConverter);
        }
    }
}