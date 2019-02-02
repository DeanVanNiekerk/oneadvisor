using Microsoft.EntityFrameworkCore;
using OneAdvisor.Data.Entities.Directory.Lookup;

namespace OneAdvisor.Data.Entities.Directory.Mappings
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