using Microsoft.EntityFrameworkCore;

namespace OneAdvisor.Data.Entities.Client.Mappings
{
    public class PolicyCommissionSplitRuleMap
    {
        public static void Map(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<PolicyCommissionSplitRuleEntity>()
                .HasOne(a => a.Policy)
                .WithMany(c => c.PolicyCommissionSplitRules)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<PolicyCommissionSplitRuleEntity>()
                .HasIndex(p => p.PolicyId)
                .IsUnique();
        }
    }
}