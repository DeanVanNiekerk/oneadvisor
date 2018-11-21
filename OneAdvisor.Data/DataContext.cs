using System;
using Microsoft.EntityFrameworkCore;
using OneAdvisor.Data.Entities.Directory;
using OneAdvisor.Data.Entities.Directory.Mappings;

namespace OneAdvisor.Data
{
    public class DataContext: DbContext
    {
        public DataContext (DbContextOptions<DataContext> options) 
            : base(options) 
        { }

        #region Directory

        public DbSet<OrganisationEntity> Organisation { get; set; }
        public DbSet<ApplicationEntity> Application { get; set; }
        public DbSet<RoleEntity> Role { get; set; }
        public DbSet<UseCaseEntity> UseCase { get; set; }
        public DbSet<RoleToUseCaseEntity> RoleToUseCase { get; set; }

        #endregion

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            #region Directory

            modelBuilder.Entity<OrganisationEntity>().ToTable("dir_Organisation");
            modelBuilder.Entity<ApplicationEntity>().ToTable("dir_Application");
            modelBuilder.Entity<RoleEntity>().ToTable("dir_Role");
            modelBuilder.Entity<UseCaseEntity>().ToTable("dir_UseCase");
            modelBuilder.Entity<RoleToUseCaseEntity>().ToTable("dir_RoleToUseCase");

            //Custom mappsings
            RoleToUseCaseMap.Map(modelBuilder);

            #endregion

            base.OnModelCreating(modelBuilder);
        }
    }
}
