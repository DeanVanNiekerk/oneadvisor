using Microsoft.EntityFrameworkCore;

namespace OneAdvisor.Data.Entities.Member.Mappings
{
    public class MemberPolicyMap
    {
        public static void Map(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<MemberPolicyEntity>()
                .HasIndex(m => new { m.CompanyId, m.Number })
                .IsUnique();
        }
    }
}