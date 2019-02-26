using System;
using Audit.EntityFramework;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using OneAdvisor.Data.Entities.Commission;
using OneAdvisor.Data.Entities.Commission.Mappings;
using OneAdvisor.Data.Entities.Directory;
using OneAdvisor.Data.Entities.Directory.Lookup;
using OneAdvisor.Data.Entities.Directory.Mappings;
using OneAdvisor.Data.Entities.Member;
using OneAdvisor.Data.Entities.Member.Mappings;

namespace OneAdvisor.Data
{
    public class DataContext : IdentityDbContext<UserEntity, RoleEntity, Guid>
    {
        public DataContext(DbContextOptions<DataContext> options)
            : base(options)
        { }

        #region Directory

        public DbSet<OrganisationEntity> Organisation { get; set; }
        public DbSet<ApplicationEntity> Application { get; set; }
        public DbSet<UseCaseEntity> UseCase { get; set; }
        public DbSet<RoleToUseCaseEntity> RoleToUseCase { get; set; }
        public DbSet<BranchEntity> Branch { get; set; }
        public DbSet<AuditLogEntity> AuditLog { get; set; }

        #region Lookup

        public DbSet<CompanyEntity> Company { get; set; }
        public DbSet<CommissionTypeEntity> CommissionType { get; set; }
        public DbSet<MarritalStatusEntity> MarritalStatus { get; set; }
        public DbSet<ContactTypeEntity> ContactType { get; set; }
        public DbSet<PolicyTypeEntity> PolicyType { get; set; }

        #endregion

        #endregion

        #region Member

        public DbSet<MemberEntity> Member { get; set; }
        public DbSet<PolicyEntity> Policy { get; set; }
        public DbSet<ContactEntity> Contact { get; set; }

        #endregion

        #region Commission

        public DbSet<CommissionEntity> Commission { get; set; }
        public DbSet<CommissionErrorEntity> CommissionError { get; set; }
        public DbSet<CommissionStatementEntity> CommissionStatement { get; set; }

        #endregion

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // #region Identity

            // modelBuilder.Entity<UserEntity>().ToTable("idnty_User");
            // modelBuilder.Entity<RoleEntity>().ToTable("idnty_Role");
            // modelBuilder.Entity<IdentityUserClaim<Guid>>().ToTable("idnty_UserClaim");
            // modelBuilder.Entity<IdentityUserRole<Guid>>().ToTable("idnty_UserRole");
            // modelBuilder.Entity<IdentityUserLogin<Guid>>().ToTable("idnty_UserLogin");
            // modelBuilder.Entity<IdentityRoleClaim<Guid>>().ToTable("idnty_RoleClaim");
            // modelBuilder.Entity<IdentityUserToken<Guid>>().ToTable("idnty_UserToken");

            // #endregion

            #region Lookup

            modelBuilder.Entity<CompanyEntity>().ToTable("lkp_Company");
            modelBuilder.Entity<CommissionTypeEntity>().ToTable("lkp_CommissionType");
            modelBuilder.Entity<MarritalStatusEntity>().ToTable("lkp_MarritalStatus");
            modelBuilder.Entity<ContactTypeEntity>().ToTable("lkp_ContactType");
            modelBuilder.Entity<PolicyTypeEntity>().ToTable("lkp_PolicyType");

            #endregion

            #region Directory

            modelBuilder.Entity<OrganisationEntity>().ToTable("dir_Organisation");
            modelBuilder.Entity<ApplicationEntity>().ToTable("dir_Application");
            modelBuilder.Entity<UseCaseEntity>().ToTable("dir_UseCase");
            modelBuilder.Entity<RoleToUseCaseEntity>().ToTable("dir_RoleToUseCase");
            modelBuilder.Entity<BranchEntity>().ToTable("dir_Branch");
            modelBuilder.Entity<AuditLogEntity>().ToTable("dir_AuditLog");

            //Custom mappings
            UserMap.Map(modelBuilder);
            RoleToUseCaseMap.Map(modelBuilder);
            CommissionTypeMap.Map(modelBuilder);

            #endregion

            #region Member

            modelBuilder.Entity<MemberEntity>().ToTable("mem_Member");
            modelBuilder.Entity<PolicyEntity>().ToTable("mem_Policy");
            modelBuilder.Entity<ContactEntity>().ToTable("mem_Contact");

            //Custom mappings
            PolicyMap.Map(modelBuilder);

            #endregion

            #region Commission

            modelBuilder.Entity<CommissionEntity>().ToTable("com_Commission");
            modelBuilder.Entity<CommissionErrorEntity>().ToTable("com_CommissionError");
            modelBuilder.Entity<CommissionStatementEntity>().ToTable("com_CommissionStatement");

            //Custom mappings
            CommissionMap.Map(modelBuilder);
            CommissionErrorMap.Map(modelBuilder);
            CommissionStatementMap.Map(modelBuilder);

            #endregion

            base.OnModelCreating(modelBuilder);
        }
    }
}
