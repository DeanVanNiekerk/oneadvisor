using Microsoft.EntityFrameworkCore;

namespace OneAdvisor.Data.Entities.Directory.Mappings
{
    public class OrganisationToCompanyMap
    {
        public static void Map(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<OrganisationToCompanyEntity>()
                .HasKey(rtuc => new { rtuc.OrganisationId, rtuc.CompanyId });

            modelBuilder.Entity<OrganisationToCompanyEntity>()
                .HasOne(rtuc => rtuc.Organisation)
                .WithMany(r => r.OrganisationToCompanies)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<OrganisationToCompanyEntity>()
                .HasOne(rtuc => rtuc.Company)
                .WithMany(uc => uc.OrganisationToCompanies)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}