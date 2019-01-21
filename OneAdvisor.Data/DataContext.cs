using System;
using Microsoft.EntityFrameworkCore;
using OneAdvisor.Data.Entities.Directory;
using OneAdvisor.Data.Entities.Directory.Lookup;
using OneAdvisor.Data.Entities.Directory.Mappings;
using OneAdvisor.Data.Entities.Member;
using OneAdvisor.Data.Entities.Member.Mappings;

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

        #region Lookup

        public DbSet<CompanyEntity> Company { get; set; }
        public DbSet<CommissionTypeEntity> CommissionType { get; set; }

        #endregion

        #endregion

        #region Member

        public DbSet<MemberEntity> Member { get; set; }
        public DbSet<PolicyEntity> Policy { get; set; }

        #endregion

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            #region Lookup

            modelBuilder.Entity<CompanyEntity>().ToTable("lkp_Company");
            modelBuilder.Entity<CommissionTypeEntity>().ToTable("lkp_CommissionType");

            #endregion

            #region Directory

            modelBuilder.Entity<OrganisationEntity>().ToTable("dir_Organisation");
            modelBuilder.Entity<ApplicationEntity>().ToTable("dir_Application");
            modelBuilder.Entity<RoleEntity>().ToTable("dir_Role");
            modelBuilder.Entity<UseCaseEntity>().ToTable("dir_UseCase");
            modelBuilder.Entity<RoleToUseCaseEntity>().ToTable("dir_RoleToUseCase");
            modelBuilder.Entity<BranchEntity>().ToTable("dir_Branch");
            modelBuilder.Entity<UserEntity>().ToTable("dir_User");

            //Custom mappings
            RoleToUseCaseMap.Map(modelBuilder);

            #endregion

            #region Member

            modelBuilder.Entity<MemberEntity>().ToTable("mem_Member");
            modelBuilder.Entity<PolicyEntity>().ToTable("mem_Policy");

            //Custom mappings
            PolicyMap.Map(modelBuilder);

            #endregion

            base.OnModelCreating(modelBuilder);
        }
    }
}
