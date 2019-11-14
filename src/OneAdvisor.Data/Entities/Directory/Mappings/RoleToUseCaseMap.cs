using Microsoft.EntityFrameworkCore;

namespace OneAdvisor.Data.Entities.Directory.Mappings
{
    public class RoleToUseCaseMap
    {
        public static void Map(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<RoleToUseCaseEntity>()
                .HasKey(rtuc => new { rtuc.RoleId, rtuc.UseCaseId });

            modelBuilder.Entity<RoleToUseCaseEntity>()
                .HasOne(rtuc => rtuc.Role)
                .WithMany(r => r.RoleToUseCases)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<RoleToUseCaseEntity>()
                .HasOne(rtuc => rtuc.UseCase)
                .WithMany(uc => uc.RoleToUseCases)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}