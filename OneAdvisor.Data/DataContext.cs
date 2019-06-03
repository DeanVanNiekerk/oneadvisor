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
using OneAdvisor.Data.Entities.Client;
using OneAdvisor.Data.Entities.Client.Mappings;
using OneAdvisor.Data.Entities.Client.Lookup;
using OneAdvisor.Data.Entities.Commission.Lookup;

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
        public DbSet<CompanyEntity> Company { get; set; }

        #endregion

        #region Client

        public DbSet<ClientEntity> Client { get; set; }
        public DbSet<PolicyEntity> Policy { get; set; }
        public DbSet<ContactEntity> Contact { get; set; }
        public DbSet<MarritalStatusEntity> MarritalStatus { get; set; }
        public DbSet<ContactTypeEntity> ContactType { get; set; }
        public DbSet<PolicyTypeEntity> PolicyType { get; set; }
        public DbSet<PolicyProductTypeEntity> PolicyProductType { get; set; }
        public DbSet<PolicyProductEntity> PolicyProduct { get; set; }
        public DbSet<ClientTypeEntity> ClientType { get; set; }

        #endregion

        #region Commission

        public DbSet<CommissionEntity> Commission { get; set; }
        public DbSet<CommissionErrorEntity> CommissionError { get; set; }
        public DbSet<CommissionStatementEntity> CommissionStatement { get; set; }
        public DbSet<CommissionStatementTemplateEntity> CommissionStatementTemplate { get; set; }
        public DbSet<CommissionTypeEntity> CommissionType { get; set; }
        public DbSet<CommissionEarningsTypeEntity> CommissionEarningsType { get; set; }
        public DbSet<CommissionAllocationEntity> CommissionAllocation { get; set; }
        public DbSet<CommissionSplitRuleEntity> CommissionSplitRule { get; set; }

        #endregion

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            #region Identity

            modelBuilder.Entity<UserEntity>().ToTable("idn_User"); ;
            modelBuilder.Entity<RoleEntity>().ToTable("idn_Role");
            modelBuilder.Entity<IdentityUserClaim<Guid>>().ToTable("idn_UserClaim");
            modelBuilder.Entity<IdentityUserRole<Guid>>().ToTable("idn_UserRole");
            modelBuilder.Entity<IdentityUserLogin<Guid>>().ToTable("idn_UserLogin");
            modelBuilder.Entity<IdentityRoleClaim<Guid>>().ToTable("idn_RoleClaim");
            modelBuilder.Entity<IdentityUserToken<Guid>>().ToTable("idn_UserToken");

            #endregion

            #region Directory

            modelBuilder.Entity<ApplicationEntity>().ToTable("dir_Application").HasData(SeedData.GetApplications());
            modelBuilder.Entity<OrganisationEntity>().ToTable("dir_Organisation");
            modelBuilder.Entity<UseCaseEntity>().ToTable("dir_UseCase").HasData(SeedData.GetUseCases());
            modelBuilder.Entity<RoleToUseCaseEntity>().ToTable("dir_RoleToUseCase");
            modelBuilder.Entity<BranchEntity>().ToTable("dir_Branch");
            modelBuilder.Entity<AuditLogEntity>().ToTable("dir_AuditLog");
            modelBuilder.Entity<CompanyEntity>().ToTable("dir_Company");

            //Custom mappings
            UserMap.Map(modelBuilder);
            RoleToUseCaseMap.Map(modelBuilder);
            CommissionTypeMap.Map(modelBuilder);
            CompanyMap.Map(modelBuilder);

            #endregion

            #region Client

            modelBuilder.Entity<ClientEntity>().ToTable("clt_Client");
            modelBuilder.Entity<PolicyEntity>().ToTable("clt_Policy");
            modelBuilder.Entity<PolicyTypeEntity>().ToTable("clt_PolicyType").HasData(SeedData.GetPolicyTypes());
            modelBuilder.Entity<PolicyProductTypeEntity>().ToTable("clt_PolicyProductType").HasData(SeedData.GetPolicyProductTypes());
            modelBuilder.Entity<PolicyProductEntity>().ToTable("clt_PolicyProduct");
            modelBuilder.Entity<ContactEntity>().ToTable("clt_Contact");
            modelBuilder.Entity<ContactTypeEntity>().ToTable("clt_ContactType").HasData(SeedData.GetContactTypes());
            modelBuilder.Entity<MarritalStatusEntity>().ToTable("clt_MarritalStatus").HasData(SeedData.GetMarritalStatus());
            modelBuilder.Entity<ClientTypeEntity>().ToTable("clt_ClientType").HasData(SeedData.GetClientTypes());

            //Custom mappings
            PolicyMap.Map(modelBuilder);

            #endregion

            #region Commission

            modelBuilder.Entity<CommissionEntity>().ToTable("com_Commission");
            modelBuilder.Entity<CommissionErrorEntity>().ToTable("com_CommissionError");
            modelBuilder.Entity<CommissionStatementEntity>().ToTable("com_CommissionStatement");
            modelBuilder.Entity<CommissionStatementTemplateEntity>().ToTable("com_CommissionStatementTemplate");
            modelBuilder.Entity<CommissionTypeEntity>().ToTable("com_CommissionType");
            modelBuilder.Entity<CommissionAllocationEntity>().ToTable("com_CommissionAllocation");
            modelBuilder.Entity<CommissionEarningsTypeEntity>().ToTable("com_CommissionEarningsType").HasData(SeedData.GetCommissionEarningsTypes());
            modelBuilder.Entity<CommissionSplitRuleEntity>().ToTable("com_CommissionSplitRule");

            //Custom mappings
            CommissionMap.Map(modelBuilder);
            CommissionErrorMap.Map(modelBuilder);
            CommissionStatementMap.Map(modelBuilder);
            CommissionStatementTemplateMap.Map(modelBuilder);
            CommissionAllocationMap.Map(modelBuilder);
            CommissionSplitRuleMap.Map(modelBuilder);

            #endregion


        }
    }
}
