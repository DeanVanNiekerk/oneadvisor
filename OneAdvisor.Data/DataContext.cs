using System;
using Microsoft.EntityFrameworkCore;
using OneAdvisor.Data.Entities.Directory;
using OneAdvisor.Data.Entities.Directory.Mappings;
using OneAdvisor.Data.Entities.Member;

namespace OneAdvisor.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options)
            : base(options)
        { }

        #region Directory

        public DbSet<OrganisationEntity> Organisation { get; set; }
        public DbSet<ApplicationEntity> Application { get; set; }
        public DbSet<RoleEntity> Role { get; set; }
        public DbSet<UseCaseEntity> UseCase { get; set; }
        public DbSet<RoleToUseCaseEntity> RoleToUseCase { get; set; }
        public DbSet<BranchEntity> Branch { get; set; }
        public DbSet<UserEntity> User { get; set; }

        #endregion

        #region Member

        public DbSet<MemberEntity> Member { get; set; }

        #endregion

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            #region Directory

            modelBuilder.Entity<OrganisationEntity>().ToTable("dir_Organisation");
            modelBuilder.Entity<ApplicationEntity>().ToTable("dir_Application");
            modelBuilder.Entity<RoleEntity>().ToTable("dir_Role");
            modelBuilder.Entity<UseCaseEntity>().ToTable("dir_UseCase");
            modelBuilder.Entity<RoleToUseCaseEntity>().ToTable("dir_RoleToUseCase");
            modelBuilder.Entity<BranchEntity>().ToTable("dir_Branch");
            modelBuilder.Entity<UserEntity>().ToTable("dir_User");

            //Custom mappsings
            RoleToUseCaseMap.Map(modelBuilder);

            #endregion

            #region Member

            modelBuilder.Entity<MemberEntity>().ToTable("mem_Member");

            #endregion

            base.OnModelCreating(modelBuilder);
        }
    }
}
