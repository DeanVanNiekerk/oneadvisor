using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using OneAdvisor.Data.Entities.Directory;
using OneAdvisor.Data.Entities.Directory.Lookup;
using OneAdvisor.Data.Entities.Client;
using OneAdvisor.Model.Directory.Model.Lookup;
using OneAdvisor.Data.Entities.Client.Lookup;
using OneAdvisor.Data.Entities.Commission.Lookup;

namespace OneAdvisor.Data
{
    public class DbInitializer : IDefaultDbContextInitializer
    {
        private readonly DataContext _context;

        private readonly Guid dirGuid = Guid.Parse("66c3b4e8-8a30-4a4b-be4d-3928d12fefe9");
        private readonly Guid cltGuid = Guid.Parse("605ea52c-3627-48e2-8f7c-4819c5ea555b");
        private readonly Guid comGuid = Guid.Parse("2fca4500-9142-4940-aaf4-b18925c96d66");

        public DbInitializer(DataContext context)
        {
            _context = context;
        }

        // public async Task<int> Clean()
        // {
        //     var total = 0;

        //     total += await _context.Database.ExecuteSqlCommandAsync("DELETE FROM [com_Commission]");
        //     total += await _context.Database.ExecuteSqlCommandAsync("DELETE FROM [com_CommissionError]");
        //     total += await _context.Database.ExecuteSqlCommandAsync("DELETE FROM [com_CommissionStatement]");

        //     total += await _context.Database.ExecuteSqlCommandAsync("DELETE FROM [clt_Contact]");
        //     total += await _context.Database.ExecuteSqlCommandAsync("DELETE FROM [clt_Policy]");
        //     total += await _context.Database.ExecuteSqlCommandAsync("DELETE FROM [clt_Client]");

        //     total += await CleanRolesAndUseCase();
        //     total += await _context.Database.ExecuteSqlCommandAsync("DELETE FROM [dir_Organisation]");
        //     total += await _context.Database.ExecuteSqlCommandAsync("DELETE FROM [dir_Branch]");
        //     total += await _context.Database.ExecuteSqlCommandAsync("DELETE FROM [dir_AuditLog]");

        //     total += await _context.Database.ExecuteSqlCommandAsync("DELETE FROM [AspNetUserTokens]");
        //     total += await _context.Database.ExecuteSqlCommandAsync("DELETE FROM [AspNetUserClaims]");
        //     total += await _context.Database.ExecuteSqlCommandAsync("DELETE FROM [AspNetUserLogins]");
        //     total += await _context.Database.ExecuteSqlCommandAsync("DELETE FROM [AspNetUsers]");

        //     total += await _context.Database.ExecuteSqlCommandAsync("DELETE FROM [lkp_Company]");
        //     total += await _context.Database.ExecuteSqlCommandAsync("DELETE FROM [lkp_CommissionType]");
        //     total += await _context.Database.ExecuteSqlCommandAsync("DELETE FROM [lkp_MarritalStatus]");
        //     total += await _context.Database.ExecuteSqlCommandAsync("DELETE FROM [lkp_PolicyType]");
        //     total += await _context.Database.ExecuteSqlCommandAsync("DELETE FROM [lkp_ContactType]");
        //     total += await _context.Database.ExecuteSqlCommandAsync("DELETE FROM [lkp_CommissionEarningsType]");

        //     return total;
        // }

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
                _context.Company.Add(new CompanyEntity() { Id = comp1Guid, Name = "Discovery Health" });
                _context.Company.Add(new CompanyEntity() { Id = Guid.NewGuid(), Name = "Momentum" });
                _context.Company.Add(new CompanyEntity() { Id = Guid.NewGuid(), Name = "Best Med" });
                _context.Company.Add(new CompanyEntity() { Id = Guid.NewGuid(), Name = "African Unity Gap" });
                _context.Company.Add(new CompanyEntity() { Id = Guid.NewGuid(), Name = "Allan Gray" });
                _context.Company.Add(new CompanyEntity() { Id = Guid.NewGuid(), Name = "Ambledown" });
                _context.Company.Add(new CompanyEntity() { Id = Guid.NewGuid(), Name = "Bonitas" });
                _context.Company.Add(new CompanyEntity() { Id = Guid.NewGuid(), Name = "Brightrock" });
                _context.Company.Add(new CompanyEntity() { Id = Guid.NewGuid(), Name = "Discovery Life" });
                _context.Company.Add(new CompanyEntity() { Id = Guid.NewGuid(), Name = "Dynamic" });
                _context.Company.Add(new CompanyEntity() { Id = Guid.NewGuid(), Name = "Fedhealth" });
                _context.Company.Add(new CompanyEntity() { Id = Guid.NewGuid(), Name = "FMI" });
                _context.Company.Add(new CompanyEntity() { Id = Guid.NewGuid(), Name = "Hollard" });
                _context.Company.Add(new CompanyEntity() { Id = Guid.NewGuid(), Name = "Liberty Life" });
                _context.Company.Add(new CompanyEntity() { Id = Guid.NewGuid(), Name = "Linksave" });
                _context.Company.Add(new CompanyEntity() { Id = Guid.NewGuid(), Name = "Medihelp" });
                _context.Company.Add(new CompanyEntity() { Id = Guid.NewGuid(), Name = "Medshield" });
                _context.Company.Add(new CompanyEntity() { Id = Guid.NewGuid(), Name = "Old Mutual" });
                _context.Company.Add(new CompanyEntity() { Id = Guid.NewGuid(), Name = "Old Mutual International" });
                _context.Company.Add(new CompanyEntity() { Id = Guid.NewGuid(), Name = "Procom" });
                _context.Company.Add(new CompanyEntity() { Id = Guid.NewGuid(), Name = "Profmed" });
                _context.Company.Add(new CompanyEntity() { Id = Guid.NewGuid(), Name = "Sanlam" });
                _context.Company.Add(new CompanyEntity() { Id = Guid.NewGuid(), Name = "Sanlam Gap" });
                _context.Company.Add(new CompanyEntity() { Id = Guid.NewGuid(), Name = "Stanlib" });
                _context.Company.Add(new CompanyEntity() { Id = Guid.NewGuid(), Name = "Stratum" });
                _context.Company.Add(new CompanyEntity() { Id = Guid.NewGuid(), Name = "Turnberry Gap" });
                _context.Company.Add(new CompanyEntity() { Id = Guid.NewGuid(), Name = "Vitality" });
                _context.Company.Add(new CompanyEntity() { Id = Guid.NewGuid(), Name = "Xelus" });
                _context.Company.Add(new CompanyEntity() { Id = Guid.NewGuid(), Name = "Zestlife" });
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

            //Lookups - Client Types
            var clientTypes = await _context.ClientType.ToListAsync();
            var individual = Guid.Parse("27bb22b3-4c3d-41a3-48bf-690a98f8f780");
            var company = Guid.Parse("295565bf-7485-85f1-6c98-947ab0b7770c");
            var trust = Guid.Parse("55f6c0ef-ae2c-faac-adff-ea3bd269043f");
            if (!clientTypes.Any())
            {
                _context.ClientType.Add(new ClientTypeEntity() { Id = individual, Name = "Individual", Code = "individual", DisplayOrder = 1 });
                _context.ClientType.Add(new ClientTypeEntity() { Id = company, Name = "Company", Code = "company", DisplayOrder = 2 });
                _context.ClientType.Add(new ClientTypeEntity() { Id = trust, Name = "Trust", Code = "trust", DisplayOrder = 3 });
            }

            //Lookups - Earnings Types
            var earningsTypes = await _context.CommissionEarningsType.ToListAsync();
            var earningsMonthAn = Guid.Parse("8b42edc0-fac6-e946-c779-9d90a805c294");
            var earningsAnnualAn = Guid.Parse("e8799015-6f4a-5d45-5be9-0fcd516e0951");
            var earningsLife = Guid.Parse("e7f98561-f018-3edd-2118-e3646c89e2a2");
            var earningsOnceOff = Guid.Parse("9f8fc29d-0f1c-b952-d446-79cc3ed967d7");
            if (!earningsTypes.Any())
            {
                _context.CommissionEarningsType.Add(new CommissionEarningsTypeEntity() { Id = earningsMonthAn, Name = "Monthly Annuity" });
                _context.CommissionEarningsType.Add(new CommissionEarningsTypeEntity() { Id = earningsAnnualAn, Name = "Annual Annuity" });
                _context.CommissionEarningsType.Add(new CommissionEarningsTypeEntity() { Id = earningsLife, Name = "Life 1st Years" });
                _context.CommissionEarningsType.Add(new CommissionEarningsTypeEntity() { Id = earningsOnceOff, Name = "Once Off Commissions" });
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
                _context.PolicyType.Add(new PolicyTypeEntity() { Id = policyTypeInv, Name = "Investment", Code = "investment" });
                _context.PolicyType.Add(new PolicyTypeEntity() { Id = policyTypeLife, Name = "Life Insurance", Code = "life_insurance" });
                _context.PolicyType.Add(new PolicyTypeEntity() { Id = policyTypeShort, Name = "Short Term Insurance", Code = "short_term" });
                _context.PolicyType.Add(new PolicyTypeEntity() { Id = policyTypeMed, Name = "Medical Cover", Code = "medical_cover" });
                _context.PolicyType.Add(new PolicyTypeEntity() { Id = policyTypeRewards, Name = "Rewards Program", Code = "rewards" });
            }

            //Lookups - Commission Type
            var commissionTypes = await _context.CommissionType.ToListAsync();
            if (!commissionTypes.Any())
            {
                _context.CommissionType.Add(new CommissionTypeEntity() { Id = CommissionType.COMMISSION_TYPE_UNKNOWN, Name = "Unknown", Code = "unknown", PolicyTypeId = policyTypeMed, CommissionEarningsTypeId = earningsMonthAn });
                _context.CommissionType.Add(new CommissionTypeEntity() { Id = Guid.NewGuid(), Name = "Gap Cover", Code = "gap_cover", PolicyTypeId = policyTypeMed, CommissionEarningsTypeId = earningsMonthAn });
                _context.CommissionType.Add(new CommissionTypeEntity() { Id = Guid.NewGuid(), Name = "Health", Code = "health", PolicyTypeId = policyTypeMed, CommissionEarningsTypeId = earningsMonthAn });
                _context.CommissionType.Add(new CommissionTypeEntity() { Id = Guid.NewGuid(), Name = "Investment Advice Fee", Code = "inv_advise_fee", PolicyTypeId = policyTypeInv, CommissionEarningsTypeId = earningsMonthAn });
                _context.CommissionType.Add(new CommissionTypeEntity() { Id = Guid.NewGuid(), Name = "Investment Premium Fee", Code = "inv_premium_fee", PolicyTypeId = policyTypeInv, CommissionEarningsTypeId = earningsMonthAn });
                _context.CommissionType.Add(new CommissionTypeEntity() { Id = Guid.NewGuid(), Name = "Investment PUFF New", Code = "inv_puff_new", PolicyTypeId = policyTypeInv, CommissionEarningsTypeId = earningsMonthAn });
                _context.CommissionType.Add(new CommissionTypeEntity() { Id = Guid.NewGuid(), Name = "Investment PUFF Old", Code = "inv_puff_old", PolicyTypeId = policyTypeInv, CommissionEarningsTypeId = earningsMonthAn });
                _context.CommissionType.Add(new CommissionTypeEntity() { Id = Guid.NewGuid(), Name = "Investment Upfront", Code = "inv_upfront", PolicyTypeId = policyTypeInv, CommissionEarningsTypeId = earningsMonthAn });
                _context.CommissionType.Add(new CommissionTypeEntity() { Id = Guid.NewGuid(), Name = "Lapse", Code = "lapse", PolicyTypeId = policyTypeInv, CommissionEarningsTypeId = earningsMonthAn });
                _context.CommissionType.Add(new CommissionTypeEntity() { Id = Guid.NewGuid(), Name = "Life 2nd Years", Code = "life_2nd_years", PolicyTypeId = policyTypeLife, CommissionEarningsTypeId = earningsMonthAn });
                _context.CommissionType.Add(new CommissionTypeEntity() { Id = Guid.NewGuid(), Name = "Life New Business", Code = "life_new_bus", PolicyTypeId = policyTypeLife, CommissionEarningsTypeId = earningsMonthAn });
                _context.CommissionType.Add(new CommissionTypeEntity() { Id = Guid.NewGuid(), Name = "Life PUFF", Code = "life_puff", PolicyTypeId = policyTypeLife, CommissionEarningsTypeId = earningsMonthAn });
                _context.CommissionType.Add(new CommissionTypeEntity() { Id = Guid.NewGuid(), Name = "Premium Reduction", Code = "premium_reduction", PolicyTypeId = policyTypeInv, CommissionEarningsTypeId = earningsMonthAn });
                _context.CommissionType.Add(new CommissionTypeEntity() { Id = Guid.NewGuid(), Name = "Group Scheme (Annual)", Code = "group_scheme_annual", PolicyTypeId = policyTypeInv, CommissionEarningsTypeId = earningsMonthAn });
                _context.CommissionType.Add(new CommissionTypeEntity() { Id = Guid.NewGuid(), Name = "Group Scheme (Monthly)", Code = "group_scheme_monthly", PolicyTypeId = policyTypeInv, CommissionEarningsTypeId = earningsMonthAn });
                _context.CommissionType.Add(new CommissionTypeEntity() { Id = Guid.NewGuid(), Name = "Rewards Program", Code = "rewards_program", PolicyTypeId = policyTypeInv, CommissionEarningsTypeId = earningsMonthAn });
                _context.CommissionType.Add(new CommissionTypeEntity() { Id = Guid.NewGuid(), Name = "Short Term Insurance (Annual)", Code = "short_term_ins_annual", PolicyTypeId = policyTypeShort, CommissionEarningsTypeId = earningsMonthAn });
                _context.CommissionType.Add(new CommissionTypeEntity() { Id = Guid.NewGuid(), Name = "Short Term Insurance (Monthly)", Code = "short_term_ins_monthly", PolicyTypeId = policyTypeShort, CommissionEarningsTypeId = earningsMonthAn });
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

            //Client Roles
            var cltRole1 = new RoleEntity() { Id = Guid.NewGuid(), Name = "clt_administrator", NormalizedName = "CLT_ADMINISTRATOR", Description = "Administrator", ApplicationId = cltGuid };
            var cltRole2 = new RoleEntity() { Id = Guid.NewGuid(), Name = "clt_readonly", NormalizedName = "CLT_READONLY", Description = "Readonly", ApplicationId = cltGuid };

            //Commision Roles
            var comRole1 = new RoleEntity() { Id = Guid.NewGuid(), Name = "com_administrator", NormalizedName = "COM_ADMINISTRATOR", Description = "Administrator", ApplicationId = comGuid };
            var comRole2 = new RoleEntity() { Id = Guid.NewGuid(), Name = "com_readonly", NormalizedName = "COM_READONLY", Description = "Readonly", ApplicationId = comGuid };

            if (!roles.Any())
            {
                _context.Roles.Add(saRole1);
                _context.Roles.Add(dirRole1);
                _context.Roles.Add(dirRole2);
                _context.Roles.Add(cltRole1);
                _context.Roles.Add(cltRole2);
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
                _context.UseCase.Add(new UseCaseEntity() { Id = "dir_edit_roles", Name = "Edit Roles", ApplicationId = dirGuid });
                _context.UseCase.Add(new UseCaseEntity() { Id = "dir_view_applications", Name = "View Applications", ApplicationId = dirGuid });
                _context.UseCase.Add(new UseCaseEntity() { Id = "dir_view_usecases", Name = "View UseCases", ApplicationId = dirGuid });
                _context.UseCase.Add(new UseCaseEntity() { Id = "dir_view_audit_logs", Name = "View Audit Logs", ApplicationId = dirGuid });

                //Directory - Lookup Use Cases
                _context.UseCase.Add(new UseCaseEntity() { Id = "dir_view_lookups", Name = "View Lookups", ApplicationId = dirGuid });
                _context.UseCase.Add(new UseCaseEntity() { Id = "dir_edit_lookups", Name = "Edit Lookups", ApplicationId = dirGuid });

                //Client Use Cases
                _context.UseCase.Add(new UseCaseEntity() { Id = "clt_view_clients", Name = "View Clients", ApplicationId = cltGuid });
                _context.UseCase.Add(new UseCaseEntity() { Id = "clt_edit_clients", Name = "Edit Clients", ApplicationId = cltGuid });
                _context.UseCase.Add(new UseCaseEntity() { Id = "clt_view_policies", Name = "View Policies", ApplicationId = cltGuid });
                _context.UseCase.Add(new UseCaseEntity() { Id = "clt_edit_policies", Name = "Edit Policies", ApplicationId = cltGuid });
                _context.UseCase.Add(new UseCaseEntity() { Id = "clt_view_contacts", Name = "View Contacts", ApplicationId = cltGuid });
                _context.UseCase.Add(new UseCaseEntity() { Id = "clt_edit_contacts", Name = "Edit Contacts", ApplicationId = cltGuid });
                _context.UseCase.Add(new UseCaseEntity() { Id = "clt_import_clients", Name = "Import Clients", ApplicationId = cltGuid });
                _context.UseCase.Add(new UseCaseEntity() { Id = "clt_export_clients", Name = "Export Clients", ApplicationId = cltGuid });

                //Commission Use Cases
                _context.UseCase.Add(new UseCaseEntity() { Id = "com_import_commissions", Name = "Import Commissions", ApplicationId = comGuid });
                _context.UseCase.Add(new UseCaseEntity() { Id = "com_view_commissions", Name = "View Commissions", ApplicationId = comGuid });
                _context.UseCase.Add(new UseCaseEntity() { Id = "com_edit_commissions", Name = "Edit Commissions", ApplicationId = comGuid });
                _context.UseCase.Add(new UseCaseEntity() { Id = "com_view_commission_statements", Name = "View Commission Statements", ApplicationId = comGuid });
                _context.UseCase.Add(new UseCaseEntity() { Id = "com_edit_commission_statements", Name = "Edit Commission Statements", ApplicationId = comGuid });
                _context.UseCase.Add(new UseCaseEntity() { Id = "com_view_commission_statement_templates", Name = "View Commission Statement Templates", ApplicationId = comGuid });
                _context.UseCase.Add(new UseCaseEntity() { Id = "com_edit_commission_statement_templates", Name = "Edit Commission Statement Templates", ApplicationId = comGuid });
                _context.UseCase.Add(new UseCaseEntity() { Id = "com_view_report_client_revenue", Name = "View Commission Client Revenue Report", ApplicationId = comGuid });
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
                _context.RoleToUseCase.Add(new RoleToUseCaseEntity() { RoleId = dirRole1.Id, UseCaseId = "dir_edit_roles" });
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

                //Client App
                //==========
                //Adminstrator
                _context.RoleToUseCase.Add(new RoleToUseCaseEntity() { RoleId = cltRole1.Id, UseCaseId = "clt_view_clients" });
                _context.RoleToUseCase.Add(new RoleToUseCaseEntity() { RoleId = cltRole1.Id, UseCaseId = "clt_edit_clients" });
                _context.RoleToUseCase.Add(new RoleToUseCaseEntity() { RoleId = cltRole1.Id, UseCaseId = "clt_import_clients" });
                _context.RoleToUseCase.Add(new RoleToUseCaseEntity() { RoleId = cltRole1.Id, UseCaseId = "clt_view_policies" });
                _context.RoleToUseCase.Add(new RoleToUseCaseEntity() { RoleId = cltRole1.Id, UseCaseId = "clt_edit_policies" });
                _context.RoleToUseCase.Add(new RoleToUseCaseEntity() { RoleId = cltRole1.Id, UseCaseId = "clt_view_contacts" });
                _context.RoleToUseCase.Add(new RoleToUseCaseEntity() { RoleId = cltRole1.Id, UseCaseId = "clt_edit_contacts" });
                _context.RoleToUseCase.Add(new RoleToUseCaseEntity() { RoleId = cltRole1.Id, UseCaseId = "clt_export_clients" });

                //Readonly
                _context.RoleToUseCase.Add(new RoleToUseCaseEntity() { RoleId = cltRole2.Id, UseCaseId = "clt_view_clients" });
                _context.RoleToUseCase.Add(new RoleToUseCaseEntity() { RoleId = cltRole2.Id, UseCaseId = "clt_view_policies" });
                _context.RoleToUseCase.Add(new RoleToUseCaseEntity() { RoleId = cltRole2.Id, UseCaseId = "clt_view_contacts" });
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
                _context.RoleToUseCase.Add(new RoleToUseCaseEntity() { RoleId = comRole1.Id, UseCaseId = "com_view_report_client_revenue" });

                //Readonly
                _context.RoleToUseCase.Add(new RoleToUseCaseEntity() { RoleId = comRole2.Id, UseCaseId = "com_view_commissions" });
                _context.RoleToUseCase.Add(new RoleToUseCaseEntity() { RoleId = comRole2.Id, UseCaseId = "com_view_commission_statements" });
                _context.RoleToUseCase.Add(new RoleToUseCaseEntity() { RoleId = comRole2.Id, UseCaseId = "com_view_commission_statement_templates" });
                _context.RoleToUseCase.Add(new RoleToUseCaseEntity() { RoleId = comRole2.Id, UseCaseId = "com_view_report_client_revenue" });
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

            application = await _context.Application.FindAsync(cltGuid);
            if (application == null)
                _context.Application.Add(new ApplicationEntity() { Id = cltGuid, Name = "Client" });

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
        //Task SeedLookups();
        //Task SeedRolesAndUseCase();
        //Task<int> Clean();
        //Task<int> CleanRolesAndUseCase();
    }

}