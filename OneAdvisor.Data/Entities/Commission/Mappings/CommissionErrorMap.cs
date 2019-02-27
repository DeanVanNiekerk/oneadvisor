using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Newtonsoft.Json;
using OneAdvisor.Data.Entities.Directory.Lookup;
using OneAdvisor.Data.ValueConverters;
using OneAdvisor.Model.Commission.Model.ImportCommission;
using OneAdvisor.Model.Directory.Model.User;

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