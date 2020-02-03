using Microsoft.EntityFrameworkCore;
using OneAdvisor.Data.Entities.Commission.Lookup;

namespace OneAdvisor.Data.Entities.Commission.Lookup.Mappings
{
    public class CommissionTypeMap
    {
        public static void Map(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<CommissionTypeEntity>()
                .HasIndex(ct => ct.Code)
                .IsUnique();
        }
    }
}