using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using OneAdvisor.Data.ValueConverters;
using OneAdvisor.Model.Commission.Model.ImportCommission;

namespace OneAdvisor.Data.Entities.Commission.Mappings
{
    public class CommissionAllocationMap
    {
        public static void Map(ModelBuilder modelBuilder)
        {
            var jsonConverter = new JsonValueConverter<List<Guid>>();

            modelBuilder.Entity<CommissionAllocationEntity>()
                .Property(c => c.PolicyIds)
                .HasConversion(jsonConverter);

            modelBuilder.Entity<CommissionAllocationEntity>()
                .HasOne(a => a.FromClient)
                .WithMany(c => c.FromCommissionAllocations)
                .HasForeignKey(a => a.FromClientId)
                .HasConstraintName("ForeignKey_FromClient_FromCommissionAllocations")
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<CommissionAllocationEntity>()
                .HasOne(a => a.ToClient)
                .WithMany(c => c.ToCommissionAllocations)
                .HasForeignKey(a => a.ToClientId)
                .HasConstraintName("ForeignKey_ToClient_ToCommissionAllocations")
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}