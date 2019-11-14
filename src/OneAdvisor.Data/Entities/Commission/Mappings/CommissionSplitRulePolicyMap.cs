using Microsoft.EntityFrameworkCore;

namespace OneAdvisor.Data.Entities.Commission.Mappings
{
    public class CommissionSplitRulePolicyMap
    {
        public static void Map(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<CommissionSplitRulePolicyEntity>()
                .HasOne(a => a.Policy)
                .WithMany(c => c.CommissionSplitRulePolicies)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<CommissionSplitRulePolicyEntity>()
                .HasIndex(p => p.PolicyId)
                .IsUnique();
        }
    }
}