﻿using System;
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
using OneAdvisor.Data.Entities.Commission.Lookup.Mappings;
using OneAdvisor.Data.Entities.Directory.Lookup.Mappings;
using OneAdvisor.Data.Entities.Client.Lookup.Mappings;

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
        public DbSet<ChangeLogEntity> ChangeLog { get; set; }
        public DbSet<UserTypeEntity> UserType { get; set; }
        public DbSet<VATRateEntity> VATRate { get; set; }
        public DbSet<AdviceScopeEntity> AdviceScope { get; set; }
        public DbSet<AdviceServiceEntity> AdviceService { get; set; }
        public DbSet<LicenseCategoryEntity> LicenseCategory { get; set; }

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
        public DbSet<PolicyTypeCharacteristicEntity> PolicyTypeCharacteristic { get; set; }

        #endregion

        #region Commission

        public DbSet<CommissionEntity> Commission { get; set; }
        public DbSet<CommissionErrorEntity> CommissionError { get; set; }
        public DbSet<CommissionStatementEntity> CommissionStatement { get; set; }
        public DbSet<CommissionStatementTemplateEntity> CommissionStatementTemplate { get; set; }
        public DbSet<CommissionTypeEntity> CommissionType { get; set; }
        public DbSet<CommissionEarningsTypeEntity> CommissionEarningsType { get; set; }
        public DbSet<CommissionAllocationEntity> CommissionAllocation { get; set; }
        public DbSet<CommissionAllocationPolicyEntity> CommissionAllocationPolicy { get; set; }
        public DbSet<CommissionSplitRuleEntity> CommissionSplitRule { get; set; }
        public DbSet<CommissionSplitRulePolicyEntity> CommissionSplitRulePolicy { get; set; }

        #endregion

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            #region Identity

            modelBuilder.Entity<UserEntity>().ToTable("idn_User");
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
            modelBuilder.Entity<ChangeLogEntity>().ToTable("dir_ChangeLog");
            modelBuilder.Entity<VATRateEntity>().ToTable("dir_VATRate").HasData(SeedData.GetVATRates());
            modelBuilder.Entity<UserTypeEntity>().ToTable("dir_UserType").HasData(SeedData.GetUserTypes());
            modelBuilder.Entity<AdviceScopeEntity>().ToTable("dir_AdviceScope").HasData(SeedData.GetAdviceScopes());
            modelBuilder.Entity<AdviceServiceEntity>().ToTable("dir_AdviceService").HasData(SeedData.GetAdviceServices());
            modelBuilder.Entity<LicenseCategoryEntity>().ToTable("dir_LicenseCategory").HasData(SeedData.GetLicenseCategories());

            //Custom mappings
            OrganisationMap.Map(modelBuilder);
            UserMap.Map(modelBuilder);
            RoleToUseCaseMap.Map(modelBuilder);
            CommissionTypeMap.Map(modelBuilder);
            CompanyMap.Map(modelBuilder);
            AuditLogMap.Map(modelBuilder);

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
            modelBuilder.Entity<PolicyTypeCharacteristicEntity>().ToTable("clt_PolicyTypeCharacteristic");

            //Custom mappings
            PolicyMap.Map(modelBuilder);
            PolicyProductTypeMap.Map(modelBuilder);

            #endregion

            #region Commission

            modelBuilder.Entity<CommissionEntity>().ToTable("com_Commission");
            modelBuilder.Entity<CommissionErrorEntity>().ToTable("com_CommissionError");
            modelBuilder.Entity<CommissionStatementEntity>().ToTable("com_CommissionStatement");
            modelBuilder.Entity<CommissionStatementTemplateEntity>().ToTable("com_CommissionStatementTemplate");
            modelBuilder.Entity<CommissionTypeEntity>().ToTable("com_CommissionType");
            modelBuilder.Entity<CommissionAllocationEntity>().ToTable("com_CommissionAllocation");
            modelBuilder.Entity<CommissionAllocationPolicyEntity>().ToTable("com_CommissionAllocationPolicy");
            modelBuilder.Entity<CommissionEarningsTypeEntity>().ToTable("com_CommissionEarningsType").HasData(SeedData.GetCommissionEarningsTypes());
            modelBuilder.Entity<CommissionSplitRuleEntity>().ToTable("com_CommissionSplitRule");
            modelBuilder.Entity<CommissionSplitRulePolicyEntity>().ToTable("com_CommissionSplitRulePolicy");

            //Custom mappings
            CommissionMap.Map(modelBuilder);
            CommissionErrorMap.Map(modelBuilder);
            CommissionStatementMap.Map(modelBuilder);
            CommissionStatementTemplateMap.Map(modelBuilder);
            CommissionAllocationMap.Map(modelBuilder);
            CommissionSplitRuleMap.Map(modelBuilder);
            CommissionSplitRulePolicyMap.Map(modelBuilder);

            #endregion
        }
    }
}
