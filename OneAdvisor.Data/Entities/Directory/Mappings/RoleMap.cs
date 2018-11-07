using Microsoft.EntityFrameworkCore;

namespace OneAdvisor.Data.Entities.Directory.Mappings
{
    public class RoleMap
    {
        public static void Map(ModelBuilder modelBuilder)
        {
            // modelBuilder.Entity<RoleEntity>()
            //     .HasMany(r => r.RoleToUseCase)
            //     .WillCascadeOnDelete(false);
        }
    }
}