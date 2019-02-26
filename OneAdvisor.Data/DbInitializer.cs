using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using OneAdvisor.Data.Entities.Directory;
using OneAdvisor.Data.Entities.Directory.Lookup;
using OneAdvisor.Data.Entities.Member;

namespace OneAdvisor.Data
{
    public class DbInitializer : IDefaultDbContextInitializer
    {
        private readonly DataContext _context;

        private readonly Guid dirGuid = Guid.Parse("66c3b4e8-8a30-4a4b-be4d-3928d12fefe9");
        private readonly Guid memGuid = Guid.Parse("605ea52c-3627-48e2-8f7c-4819c5ea555b");
        private readonly Guid comGuid = Guid.Parse("2fca4500-9142-4940-aaf4-b18925c96d66");

        public DbInitializer(DataContext context)
        {
            _context = context;
        }

        public async Task<int> Clean()
        {
            var total = 0;

            total += await _context.Database.ExecuteSqlCommandAsync("DELETE FROM [com_Commission]");
            total += await _context.Database.ExecuteSqlCommandAsync("DELETE FROM [com_CommissionError]");
            total += await _context.Database.ExecuteSqlCommandAsync("DELETE FROM [com_CommissionStatement]");

            total += await _context.Database.ExecuteSqlCommandAsync("DELETE FROM [mem_Contact]");
            total += await _context.Database.ExecuteSqlCommandAsync("DELETE FROM [mem_Policy]");
            total += await _context.Database.ExecuteSqlCommandAsync("DELETE FROM [mem_Member]");

            total += await CleanRolesAndUseCase();
            total += await _context.Database.ExecuteSqlCommandAsync("DELETE FROM [dir_Organisation]");
            total += await _context.Database.ExecuteSqlCommandAsync("DELETE FROM [dir_Branch]");
            total += await _context.Database.ExecuteSqlCommandAsync("DELETE FROM [dir_AuditLog]");

            total += await _context.Database.ExecuteSqlCommandAsync("DELETE FROM [AspNetUserTokens]");
            total += await _context.Database.ExecuteSqlCommandAsync("DELETE FROM [AspNetUserClaims]");
            total += await _context.Database.ExecuteSqlCommandAsync("DELETE FROM [AspNetUserLogins]");
            total += await _context.Database.ExecuteSqlCommandAsync("DELETE FROM [AspNetUsers]");

            total += await _context.Database.ExecuteSqlCommandAsync("DELETE FROM [lkp_Company]");
            total += await _context.Database.ExecuteSqlCommandAsync("DELETE FROM [lkp_CommissionType]");
            total += await _context.Database.ExecuteSqlCommandAsync("DELETE FROM [lkp_MarritalStatus]");
            total += await _context.Database.ExecuteSqlCommandAsync("DELETE FROM [lkp_PolicyType]");
            total += await _context.Database.ExecuteSqlCommandAsync("DELETE FROM [lkp_ContactType]");

            return total;
        }

        public async Task<int> CleanRolesAndUseCase()
        {
            var total = 0;

            total += await _context.Database.ExecuteSqlCommandAsync("DELETE FROM [dir_RoleToUseCase]");
            total += await _context.Database.ExecuteSqlCommandAsync("DELETE FROM [dir_UseCase]");

            total += await _context.Database.ExecuteSqlCommandAsync("DELETE FROM [AspNetUserRoles]");
            total += await _context.Database.ExecuteSqlCommandAsync("DELETE FROM [AspNetRoles]");

            return total;
        }

        public async Task SeedLookups()
        {
            //Lookups - Companies
            var companies = _context.Company.ToList();
            var comp1Guid = Guid.NewGuid();
            if (!companies.Any())
            {
                _context.Company.Add(new CompanyEntity() { Id = comp1Guid, Name = "Discovery" });
                _context.Company.Add(new CompanyEntity() { Id = Guid.NewGuid(), Name = "Momentum" });
                _context.Company.Add(new CompanyEntity() { Id = Guid.NewGuid(), Name = "Best Med" });
            }

            //Lookups - Marrital Status
            var marritalStatus = await _context.MarritalStatus.ToListAsync();
            if (!marritalStatus.Any())
            {
                _context.MarritalStatus.Add(new MarritalStatusEntity() { Id = Guid.Parse("77fa3769-7775-4cdd-b5d4-8b526b2d894c"), Name = "Single" });
                _context.MarritalStatus.Add(new MarritalStatusEntity() { Id = Guid.Parse("5f7a5d69-845c-4f8d-b108-7c70084f3f6a"), Name = "Married COP" });
                _context.MarritalStatus.Add(new MarritalStatusEntity() { Id = Guid.Parse("b31331ec-73cb-4985-aa93-e60e04a48095"), Name = "Married ANC" });
                _context.MarritalStatus.Add(new MarritalStatusEntity() { Id = Guid.Parse("b16cbd3b-cf50-4a74-8f38-a8ca6b1cb83f"), Name = "Married ANC (with Accrual)" });
                _context.MarritalStatus.Add(new MarritalStatusEntity() { Id = Guid.Parse("e4f03497-5dbf-4bd0-bc14-660a3969f011"), Name = "Widowed" });
                _context.MarritalStatus.Add(new MarritalStatusEntity() { Id = Guid.Parse("91ebd765-bd8b-4908-94dc-00f09fe37ca7"), Name = "Divorced" });
            }

            //Lookups - Policy Types
            var policyTypes = await _context.PolicyType.ToListAsync();
            var policyTypeInv = Guid.Parse("a98bb718-4acb-4fad-afe9-5fbba00203b9");
            var policyTypeLife = Guid.Parse("f3d877b4-1800-4711-8cc9-35169f8bd60b");
            var policyTypeShort = Guid.Parse("a90a5869-4da5-4cce-8973-9a8194c2bdcb");
            var policyTypeMed = Guid.Parse("023107f5-97a6-456d-9182-7bbda72ca82a");
            var policyTypeRewards = Guid.Parse("3d991459-2043-46b9-9357-5446a993b81d");
            if (!policyTypes.Any())
            {
                _context.PolicyType.Add(new PolicyTypeEntity() { Id = policyTypeInv, Name = "Investment" });
                _context.PolicyType.Add(new PolicyTypeEntity() { Id = policyTypeLife, Name = "Life Insurance" });
                _context.PolicyType.Add(new PolicyTypeEntity() { Id = policyTypeShort, Name = "Short Term Insurance" });
                _context.PolicyType.Add(new PolicyTypeEntity() { Id = policyTypeMed, Name = "Medical Cover" });
                _context.PolicyType.Add(new PolicyTypeEntity() { Id = policyTypeRewards, Name = "Rewards Program" });
            }

            //Lookups - Commission Type
            var commissionTypes = await _context.CommissionType.ToListAsync();
            if (!commissionTypes.Any())
            {
                _context.CommissionType.Add(new CommissionTypeEntity() { Id = Guid.NewGuid(), Name = "Gap Cover", Code = "gap_cover", PolicyTypeId = policyTypeMed });
                _context.CommissionType.Add(new CommissionTypeEntity() { Id = Guid.NewGuid(), Name = "Health", Code = "health", PolicyTypeId = policyTypeMed });
                _context.CommissionType.Add(new CommissionTypeEntity() { Id = Guid.NewGuid(), Name = "Investment Advice Fee", Code = "inv_advise_fee", PolicyTypeId = policyTypeInv });
                _context.CommissionType.Add(new CommissionTypeEntity() { Id = Guid.NewGuid(), Name = "Investment Premium Fee", Code = "inv_premium_fee", PolicyTypeId = policyTypeInv });
                _context.CommissionType.Add(new CommissionTypeEntity() { Id = Guid.NewGuid(), Name = "Investment PUFF New", Code = "inv_puff_new", PolicyTypeId = policyTypeInv });
                _context.CommissionType.Add(new CommissionTypeEntity() { Id = Guid.NewGuid(), Name = "Investment PUFF Old", Code = "inv_puff_old", PolicyTypeId = policyTypeInv });
                _context.CommissionType.Add(new CommissionTypeEntity() { Id = Guid.NewGuid(), Name = "Investment Upfront", Code = "inv_upfront", PolicyTypeId = policyTypeInv });
                _context.CommissionType.Add(new CommissionTypeEntity() { Id = Guid.NewGuid(), Name = "Lapse", Code = "lapse", PolicyTypeId = policyTypeInv });
                _context.CommissionType.Add(new CommissionTypeEntity() { Id = Guid.NewGuid(), Name = "Life 2nd Years", Code = "life_2nd_years", PolicyTypeId = policyTypeLife });
                _context.CommissionType.Add(new CommissionTypeEntity() { Id = Guid.NewGuid(), Name = "Life New Business", Code = "life_new_bus", PolicyTypeId = policyTypeLife });
                _context.CommissionType.Add(new CommissionTypeEntity() { Id = Guid.NewGuid(), Name = "Life PUFF", Code = "life_puff", PolicyTypeId = policyTypeLife });
                _context.CommissionType.Add(new CommissionTypeEntity() { Id = Guid.NewGuid(), Name = "Premium Reduction", Code = "premium_reduction", PolicyTypeId = policyTypeInv });
                _context.CommissionType.Add(new CommissionTypeEntity() { Id = Guid.NewGuid(), Name = "Group Scheme (Annual)", Code = "group_scheme_annual", PolicyTypeId = policyTypeInv });
                _context.CommissionType.Add(new CommissionTypeEntity() { Id = Guid.NewGuid(), Name = "Group Scheme (Monthly)", Code = "group_scheme_monthly", PolicyTypeId = policyTypeInv });
                _context.CommissionType.Add(new CommissionTypeEntity() { Id = Guid.NewGuid(), Name = "Rewards Program", Code = "rewards_program", PolicyTypeId = policyTypeInv });
                _context.CommissionType.Add(new CommissionTypeEntity() { Id = Guid.NewGuid(), Name = "Short Term Insurance (Annual)", Code = "short_term_ins_annual", PolicyTypeId = policyTypeShort });
                _context.CommissionType.Add(new CommissionTypeEntity() { Id = Guid.NewGuid(), Name = "Short Term Insurance (Monthly)", Code = "short_term_ins_monthly", PolicyTypeId = policyTypeShort });
            }

            //Lookups - Contact Types
            var contactTypes = await _context.ContactType.ToListAsync();
            if (!contactTypes.Any())
            {
                _context.ContactType.Add(new ContactTypeEntity() { Id = Guid.Parse("d6349e22-3e27-404a-8584-58e420510834"), Name = "Cellphone Number" });
                _context.ContactType.Add(new ContactTypeEntity() { Id = Guid.Parse("b3c261d0-4e1d-4dd8-b944-6d6afd1795e0"), Name = "Email Address" });
            }

            _context.SaveChanges();
        }

        public async Task SeedRolesAndUseCase()
        {
            var roles = await _context.Roles.ToListAsync();

            var saRole1 = new RoleEntity() { Id = Guid.NewGuid(), Name = "super_administrator", NormalizedName = "SUPER_ADMINISTRATOR", Description = "Super Administrator", ApplicationId = null };

            //Directory Roles
            var dirRole1 = new RoleEntity() { Id = Guid.NewGuid(), Name = "dir_administrator", NormalizedName = "DIR_ADMINISTRATOR", Description = "Administrator", ApplicationId = dirGuid };
            var dirRole2 = new RoleEntity() { Id = Guid.NewGuid(), Name = "dir_readonly", NormalizedName = "DIR_READONLY", Description = "Readonly", ApplicationId = dirGuid };

            //Member Roles
            var memRole1 = new RoleEntity() { Id = Guid.NewGuid(), Name = "mem_administrator", NormalizedName = "MEM_ADMINISTRATOR", Description = "Administrator", ApplicationId = memGuid };
            var memRole2 = new RoleEntity() { Id = Guid.NewGuid(), Name = "mem_readonly", NormalizedName = "MEM_READONLY", Description = "Readonly", ApplicationId = memGuid };

            //Commision Roles
            var comRole1 = new RoleEntity() { Id = Guid.NewGuid(), Name = "com_administrator", NormalizedName = "COM_ADMINISTRATOR", Description = "Administrator", ApplicationId = comGuid };
            var comRole2 = new RoleEntity() { Id = Guid.NewGuid(), Name = "com_readonly", NormalizedName = "COM_READONLY", Description = "Readonly", ApplicationId = comGuid };

            if (!roles.Any())
            {
                _context.Roles.Add(saRole1);
                _context.Roles.Add(dirRole1);
                _context.Roles.Add(dirRole2);
                _context.Roles.Add(memRole1);
                _context.Roles.Add(memRole2);
                _context.Roles.Add(comRole1);
                _context.Roles.Add(comRole2);
            }

            var useCases = await _context.UseCase.ToListAsync();
            if (!useCases.Any())
            {
                //Directory Use Cases
                _context.UseCase.Add(new UseCaseEntity() { Id = "dir_view_users", Name = "View Users", ApplicationId = dirGuid });
                _context.UseCase.Add(new UseCaseEntity() { Id = "dir_edit_users", Name = "Edit Users", ApplicationId = dirGuid });
                _context.UseCase.Add(new UseCaseEntity() { Id = "dir_view_organisations", Name = "View Organisations", ApplicationId = dirGuid });
                _context.UseCase.Add(new UseCaseEntity() { Id = "dir_edit_organisations", Name = "Edit Organisations", ApplicationId = dirGuid });
                _context.UseCase.Add(new UseCaseEntity() { Id = "dir_view_branches", Name = "View Branches", ApplicationId = dirGuid });
                _context.UseCase.Add(new UseCaseEntity() { Id = "dir_edit_branches", Name = "Edit Branches", ApplicationId = dirGuid });
                _context.UseCase.Add(new UseCaseEntity() { Id = "dir_view_roles", Name = "View Roles", ApplicationId = dirGuid });
                _context.UseCase.Add(new UseCaseEntity() { Id = "dir_view_applications", Name = "View Applications", ApplicationId = dirGuid });
                _context.UseCase.Add(new UseCaseEntity() { Id = "dir_view_usecases", Name = "View UseCases", ApplicationId = dirGuid });
                _context.UseCase.Add(new UseCaseEntity() { Id = "dir_view_audit_logs", Name = "View Audit Logs", ApplicationId = dirGuid });

                //Directory - Lookup Use Cases
                _context.UseCase.Add(new UseCaseEntity() { Id = "dir_view_lookups", Name = "View Lookups", ApplicationId = dirGuid });
                _context.UseCase.Add(new UseCaseEntity() { Id = "dir_edit_lookups", Name = "Edit Lookups", ApplicationId = dirGuid });

                //Member Use Cases
                _context.UseCase.Add(new UseCaseEntity() { Id = "mem_view_members", Name = "View Members", ApplicationId = memGuid });
                _context.UseCase.Add(new UseCaseEntity() { Id = "mem_edit_members", Name = "Edit Members", ApplicationId = memGuid });
                _context.UseCase.Add(new UseCaseEntity() { Id = "mem_view_policies", Name = "View Policies", ApplicationId = memGuid });
                _context.UseCase.Add(new UseCaseEntity() { Id = "mem_edit_policies", Name = "Edit Policies", ApplicationId = memGuid });
                _context.UseCase.Add(new UseCaseEntity() { Id = "mem_view_contacts", Name = "View Contacts", ApplicationId = memGuid });
                _context.UseCase.Add(new UseCaseEntity() { Id = "mem_edit_contacts", Name = "Edit Contacts", ApplicationId = memGuid });
                _context.UseCase.Add(new UseCaseEntity() { Id = "mem_import_members", Name = "Import Members", ApplicationId = memGuid });
                _context.UseCase.Add(new UseCaseEntity() { Id = "mem_export_members", Name = "Export Members", ApplicationId = memGuid });

                //Commission Use Cases
                _context.UseCase.Add(new UseCaseEntity() { Id = "com_import_commissions", Name = "Import Commissions", ApplicationId = comGuid });
                _context.UseCase.Add(new UseCaseEntity() { Id = "com_view_commissions", Name = "View Commissions", ApplicationId = comGuid });
                _context.UseCase.Add(new UseCaseEntity() { Id = "com_edit_commissions", Name = "Edit Commissions", ApplicationId = comGuid });
                _context.UseCase.Add(new UseCaseEntity() { Id = "com_view_commission_statements", Name = "View Commission Statements", ApplicationId = comGuid });
                _context.UseCase.Add(new UseCaseEntity() { Id = "com_edit_commission_statements", Name = "Edit Commission Statements", ApplicationId = comGuid });
                _context.UseCase.Add(new UseCaseEntity() { Id = "com_view_commission_statement_templates", Name = "View Commission Statement Templates", ApplicationId = comGuid });
                _context.UseCase.Add(new UseCaseEntity() { Id = "com_edit_commission_statement_templates", Name = "Edit Commission Statement Templates", ApplicationId = comGuid });
            }

            var roleToUseCase = await _context.RoleToUseCase.ToListAsync();
            if (!roleToUseCase.Any())
            {
                //Role to Use Case

                //Directory App
                //=============
                //Adminstrator 
                _context.RoleToUseCase.Add(new RoleToUseCaseEntity() { RoleId = dirRole1.Id, UseCaseId = "dir_view_users" });
                _context.RoleToUseCase.Add(new RoleToUseCaseEntity() { RoleId = dirRole1.Id, UseCaseId = "dir_edit_users" });
                _context.RoleToUseCase.Add(new RoleToUseCaseEntity() { RoleId = dirRole1.Id, UseCaseId = "dir_view_organisations" });
                _context.RoleToUseCase.Add(new RoleToUseCaseEntity() { RoleId = dirRole1.Id, UseCaseId = "dir_edit_organisations" });
                _context.RoleToUseCase.Add(new RoleToUseCaseEntity() { RoleId = dirRole1.Id, UseCaseId = "dir_view_branches" });
                _context.RoleToUseCase.Add(new RoleToUseCaseEntity() { RoleId = dirRole1.Id, UseCaseId = "dir_edit_branches" });
                _context.RoleToUseCase.Add(new RoleToUseCaseEntity() { RoleId = dirRole1.Id, UseCaseId = "dir_view_roles" });
                _context.RoleToUseCase.Add(new RoleToUseCaseEntity() { RoleId = dirRole1.Id, UseCaseId = "dir_view_applications" });
                _context.RoleToUseCase.Add(new RoleToUseCaseEntity() { RoleId = dirRole1.Id, UseCaseId = "dir_view_usecases" });
                _context.RoleToUseCase.Add(new RoleToUseCaseEntity() { RoleId = dirRole1.Id, UseCaseId = "dir_view_lookups" });
                _context.RoleToUseCase.Add(new RoleToUseCaseEntity() { RoleId = dirRole1.Id, UseCaseId = "dir_edit_lookups" });
                _context.RoleToUseCase.Add(new RoleToUseCaseEntity() { RoleId = dirRole1.Id, UseCaseId = "dir_view_audit_logs" });

                //Readonly 
                _context.RoleToUseCase.Add(new RoleToUseCaseEntity() { RoleId = dirRole2.Id, UseCaseId = "dir_view_users" });
                _context.RoleToUseCase.Add(new RoleToUseCaseEntity() { RoleId = dirRole2.Id, UseCaseId = "dir_view_organisations" });
                _context.RoleToUseCase.Add(new RoleToUseCaseEntity() { RoleId = dirRole2.Id, UseCaseId = "dir_view_branches" });
                _context.RoleToUseCase.Add(new RoleToUseCaseEntity() { RoleId = dirRole2.Id, UseCaseId = "dir_view_roles" });
                _context.RoleToUseCase.Add(new RoleToUseCaseEntity() { RoleId = dirRole2.Id, UseCaseId = "dir_view_applications" });
                _context.RoleToUseCase.Add(new RoleToUseCaseEntity() { RoleId = dirRole2.Id, UseCaseId = "dir_view_usecases" });
                _context.RoleToUseCase.Add(new RoleToUseCaseEntity() { RoleId = dirRole2.Id, UseCaseId = "dir_view_lookups" });
                _context.RoleToUseCase.Add(new RoleToUseCaseEntity() { RoleId = dirRole2.Id, UseCaseId = "dir_view_audit_logs" });
                //--------------------------------------------------------------------------------------------------------------------------------------------

                //Member App
                //==========
                //Adminstrator
                _context.RoleToUseCase.Add(new RoleToUseCaseEntity() { RoleId = memRole1.Id, UseCaseId = "mem_view_members" });
                _context.RoleToUseCase.Add(new RoleToUseCaseEntity() { RoleId = memRole1.Id, UseCaseId = "mem_edit_members" });
                _context.RoleToUseCase.Add(new RoleToUseCaseEntity() { RoleId = memRole1.Id, UseCaseId = "mem_import_members" });
                _context.RoleToUseCase.Add(new RoleToUseCaseEntity() { RoleId = memRole1.Id, UseCaseId = "mem_view_policies" });
                _context.RoleToUseCase.Add(new RoleToUseCaseEntity() { RoleId = memRole1.Id, UseCaseId = "mem_edit_policies" });
                _context.RoleToUseCase.Add(new RoleToUseCaseEntity() { RoleId = memRole1.Id, UseCaseId = "mem_view_contacts" });
                _context.RoleToUseCase.Add(new RoleToUseCaseEntity() { RoleId = memRole1.Id, UseCaseId = "mem_edit_contacts" });
                _context.RoleToUseCase.Add(new RoleToUseCaseEntity() { RoleId = memRole1.Id, UseCaseId = "mem_export_members" });

                //Readonly
                _context.RoleToUseCase.Add(new RoleToUseCaseEntity() { RoleId = memRole2.Id, UseCaseId = "mem_view_members" });
                _context.RoleToUseCase.Add(new RoleToUseCaseEntity() { RoleId = memRole2.Id, UseCaseId = "mem_view_policies" });
                _context.RoleToUseCase.Add(new RoleToUseCaseEntity() { RoleId = memRole2.Id, UseCaseId = "mem_view_contacts" });
                //--------------------------------------------------------------------------------------------------------------------------------------------

                //Commission App
                //==============
                //Adminstrator
                _context.RoleToUseCase.Add(new RoleToUseCaseEntity() { RoleId = comRole1.Id, UseCaseId = "com_import_commissions" });
                _context.RoleToUseCase.Add(new RoleToUseCaseEntity() { RoleId = comRole1.Id, UseCaseId = "com_view_commissions" });
                _context.RoleToUseCase.Add(new RoleToUseCaseEntity() { RoleId = comRole1.Id, UseCaseId = "com_edit_commissions" });
                _context.RoleToUseCase.Add(new RoleToUseCaseEntity() { RoleId = comRole1.Id, UseCaseId = "com_view_commission_statements" });
                _context.RoleToUseCase.Add(new RoleToUseCaseEntity() { RoleId = comRole1.Id, UseCaseId = "com_edit_commission_statements" });
                _context.RoleToUseCase.Add(new RoleToUseCaseEntity() { RoleId = comRole1.Id, UseCaseId = "com_view_commission_statement_templates" });
                _context.RoleToUseCase.Add(new RoleToUseCaseEntity() { RoleId = comRole1.Id, UseCaseId = "com_edit_commission_statement_templates" });

                //Readonly
                _context.RoleToUseCase.Add(new RoleToUseCaseEntity() { RoleId = comRole2.Id, UseCaseId = "com_view_commissions" });
                _context.RoleToUseCase.Add(new RoleToUseCaseEntity() { RoleId = comRole2.Id, UseCaseId = "com_view_commission_statements" });
                _context.RoleToUseCase.Add(new RoleToUseCaseEntity() { RoleId = comRole2.Id, UseCaseId = "com_view_commission_statement_templates" });
                //--------------------------------------------------------------------------------------------------------------------------------------------
            }

            _context.SaveChanges();
        }

        public async Task Seed()
        {
            await SeedLookups();

            var application = await _context.Application.FindAsync(dirGuid);
            if (application == null)
                _context.Application.Add(new ApplicationEntity() { Id = dirGuid, Name = "Directory" });

            application = await _context.Application.FindAsync(memGuid);
            if (application == null)
                _context.Application.Add(new ApplicationEntity() { Id = memGuid, Name = "Member" });

            application = await _context.Application.FindAsync(comGuid);
            if (application == null)
                _context.Application.Add(new ApplicationEntity() { Id = comGuid, Name = "Commission" });

            await SeedRolesAndUseCase();

            //Organisations
            var organisations = await _context.Organisation.ToListAsync();
            var sabOrgId = Guid.Parse("9a46c5ae-3f6f-494c-b0de-d908f08507c3");
            var lifeOrgId = Guid.Parse("d44abb82-9eab-47a3-b20c-61b4ee93bf21");
            if (!organisations.Any())
            {

                _context.Organisation.Add(new OrganisationEntity() { Id = sabOrgId, Name = "Smith and Bormann" });
                _context.Organisation.Add(new OrganisationEntity() { Id = lifeOrgId, Name = "Life Brokers" });
            }

            //Branches
            var branches = await _context.Branch.ToListAsync();
            var peBranchId = Guid.Parse("c036cf47-ae1c-4c25-be8f-110a59a5407a");
            if (!branches.Any())
            {
                _context.Branch.Add(new BranchEntity() { Id = Guid.Parse("cfaa7bf4-bff8-4c8c-b71e-f64bd8249750"), OrganisationId = sabOrgId, Name = "Shelly Beach" });
                _context.Branch.Add(new BranchEntity() { Id = peBranchId, OrganisationId = sabOrgId, Name = "Port Elizabeth" });
                _context.Branch.Add(new BranchEntity() { Id = Guid.Parse("7ab8bcd9-0544-4613-a82e-06b6de99d7ac"), OrganisationId = lifeOrgId, Name = "Durban" });
            }

            _context.SaveChanges();
        }
    }

    public interface IDefaultDbContextInitializer
    {
        Task Seed();
        Task SeedLookups();
        Task SeedRolesAndUseCase();
        Task<int> Clean();
        Task<int> CleanRolesAndUseCase();
    }

}