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
using System.Collections.Generic;
using OneAdvisor.Model.Commission.Model.Lookup;

namespace OneAdvisor.Data
{
    public class DbInitializer : IDefaultDbContextInitializer
    {
        private readonly DataContext _context;

        public DbInitializer(DataContext context)
        {
            _context = context;
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

            //Lookups - Commission Type
            var commissionTypes = await _context.CommissionType.ToListAsync();
            if (!commissionTypes.Any())
            {
                _context.CommissionType.Add(new CommissionTypeEntity() { Id = CommissionType.COMMISSION_TYPE_UNKNOWN, Name = "Unknown", Code = "unknown", PolicyTypeId = SeedData.policyTypeMed, CommissionEarningsTypeId = SeedData.earningsMonthAn });
                _context.CommissionType.Add(new CommissionTypeEntity() { Id = Guid.NewGuid(), Name = "Gap Cover", Code = "gap_cover", PolicyTypeId = SeedData.policyTypeMed, CommissionEarningsTypeId = SeedData.earningsMonthAn });
                _context.CommissionType.Add(new CommissionTypeEntity() { Id = Guid.NewGuid(), Name = "Health", Code = "health", PolicyTypeId = SeedData.policyTypeMed, CommissionEarningsTypeId = SeedData.earningsMonthAn });
                _context.CommissionType.Add(new CommissionTypeEntity() { Id = Guid.NewGuid(), Name = "Investment Advice Fee", Code = "inv_advise_fee", PolicyTypeId = SeedData.policyTypeInv, CommissionEarningsTypeId = SeedData.earningsMonthAn });
                _context.CommissionType.Add(new CommissionTypeEntity() { Id = Guid.NewGuid(), Name = "Investment Premium Fee", Code = "inv_premium_fee", PolicyTypeId = SeedData.policyTypeInv, CommissionEarningsTypeId = SeedData.earningsMonthAn });
                _context.CommissionType.Add(new CommissionTypeEntity() { Id = Guid.NewGuid(), Name = "Investment PUFF New", Code = "inv_puff_new", PolicyTypeId = SeedData.policyTypeInv, CommissionEarningsTypeId = SeedData.earningsMonthAn });
                _context.CommissionType.Add(new CommissionTypeEntity() { Id = Guid.NewGuid(), Name = "Investment PUFF Old", Code = "inv_puff_old", PolicyTypeId = SeedData.policyTypeInv, CommissionEarningsTypeId = SeedData.earningsMonthAn });
                _context.CommissionType.Add(new CommissionTypeEntity() { Id = Guid.NewGuid(), Name = "Investment Upfront", Code = "inv_upfront", PolicyTypeId = SeedData.policyTypeInv, CommissionEarningsTypeId = SeedData.earningsMonthAn });
                _context.CommissionType.Add(new CommissionTypeEntity() { Id = Guid.NewGuid(), Name = "Lapse", Code = "lapse", PolicyTypeId = SeedData.policyTypeInv, CommissionEarningsTypeId = SeedData.earningsMonthAn });
                _context.CommissionType.Add(new CommissionTypeEntity() { Id = Guid.NewGuid(), Name = "Life 2nd Years", Code = "life_2nd_years", PolicyTypeId = SeedData.policyTypeLife, CommissionEarningsTypeId = SeedData.earningsMonthAn });
                _context.CommissionType.Add(new CommissionTypeEntity() { Id = Guid.NewGuid(), Name = "Life New Business", Code = "life_new_bus", PolicyTypeId = SeedData.policyTypeLife, CommissionEarningsTypeId = SeedData.earningsMonthAn });
                _context.CommissionType.Add(new CommissionTypeEntity() { Id = Guid.NewGuid(), Name = "Life PUFF", Code = "life_puff", PolicyTypeId = SeedData.policyTypeLife, CommissionEarningsTypeId = SeedData.earningsMonthAn });
                _context.CommissionType.Add(new CommissionTypeEntity() { Id = Guid.NewGuid(), Name = "Premium Reduction", Code = "premium_reduction", PolicyTypeId = SeedData.policyTypeInv, CommissionEarningsTypeId = SeedData.earningsMonthAn });
                _context.CommissionType.Add(new CommissionTypeEntity() { Id = Guid.NewGuid(), Name = "Group Scheme (Annual)", Code = "group_scheme_annual", PolicyTypeId = SeedData.policyTypeInv, CommissionEarningsTypeId = SeedData.earningsMonthAn });
                _context.CommissionType.Add(new CommissionTypeEntity() { Id = Guid.NewGuid(), Name = "Group Scheme (Monthly)", Code = "group_scheme_monthly", PolicyTypeId = SeedData.policyTypeInv, CommissionEarningsTypeId = SeedData.earningsMonthAn });
                _context.CommissionType.Add(new CommissionTypeEntity() { Id = Guid.NewGuid(), Name = "Rewards Program", Code = "rewards_program", PolicyTypeId = SeedData.policyTypeInv, CommissionEarningsTypeId = SeedData.earningsMonthAn });
                _context.CommissionType.Add(new CommissionTypeEntity() { Id = Guid.NewGuid(), Name = "Short Term Insurance (Annual)", Code = "short_term_ins_annual", PolicyTypeId = SeedData.policyTypeShort, CommissionEarningsTypeId = SeedData.earningsMonthAn });
                _context.CommissionType.Add(new CommissionTypeEntity() { Id = Guid.NewGuid(), Name = "Short Term Insurance (Monthly)", Code = "short_term_ins_monthly", PolicyTypeId = SeedData.policyTypeShort, CommissionEarningsTypeId = SeedData.earningsMonthAn });
            }

            _context.SaveChanges();
        }

        public async Task SeedRoles()
        {
            var roles = await _context.Roles.ToListAsync();

            var saRole1 = new RoleEntity() { Id = Guid.NewGuid(), Name = "super_administrator", NormalizedName = "SUPER_ADMINISTRATOR", Description = "Super Administrator", ApplicationId = null };

            //Directory Roles
            var dirRole1 = new RoleEntity() { Id = Guid.NewGuid(), Name = "dir_administrator", NormalizedName = "DIR_ADMINISTRATOR", Description = "Administrator", ApplicationId = SeedData.dirGuid };
            var dirRole2 = new RoleEntity() { Id = Guid.NewGuid(), Name = "dir_readonly", NormalizedName = "DIR_READONLY", Description = "Readonly", ApplicationId = SeedData.dirGuid };

            //Client Roles
            var cltRole1 = new RoleEntity() { Id = Guid.NewGuid(), Name = "clt_administrator", NormalizedName = "CLT_ADMINISTRATOR", Description = "Administrator", ApplicationId = SeedData.cltGuid };
            var cltRole2 = new RoleEntity() { Id = Guid.NewGuid(), Name = "clt_readonly", NormalizedName = "CLT_READONLY", Description = "Readonly", ApplicationId = SeedData.cltGuid };

            //Commision Roles
            var comRole1 = new RoleEntity() { Id = Guid.NewGuid(), Name = "com_administrator", NormalizedName = "COM_ADMINISTRATOR", Description = "Administrator", ApplicationId = SeedData.comGuid };
            var comRole2 = new RoleEntity() { Id = Guid.NewGuid(), Name = "com_readonly", NormalizedName = "COM_READONLY", Description = "Readonly", ApplicationId = SeedData.comGuid };

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
                _context.RoleToUseCase.Add(new RoleToUseCaseEntity() { RoleId = comRole1.Id, UseCaseId = "com_edit_commission_split_rules" });
                _context.RoleToUseCase.Add(new RoleToUseCaseEntity() { RoleId = comRole1.Id, UseCaseId = "com_view_commission_split_rules" });

                //Readonly
                _context.RoleToUseCase.Add(new RoleToUseCaseEntity() { RoleId = comRole2.Id, UseCaseId = "com_view_commissions" });
                _context.RoleToUseCase.Add(new RoleToUseCaseEntity() { RoleId = comRole2.Id, UseCaseId = "com_view_commission_statements" });
                _context.RoleToUseCase.Add(new RoleToUseCaseEntity() { RoleId = comRole2.Id, UseCaseId = "com_view_commission_statement_templates" });
                _context.RoleToUseCase.Add(new RoleToUseCaseEntity() { RoleId = comRole2.Id, UseCaseId = "com_view_report_client_revenue" });
                _context.RoleToUseCase.Add(new RoleToUseCaseEntity() { RoleId = comRole2.Id, UseCaseId = "com_view_commission_split_rules" });
                //--------------------------------------------------------------------------------------------------------------------------------------------
            }

            _context.SaveChanges();
        }

        public async Task Seed()
        {
            await SeedLookups();

            await SeedRoles();

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
    }

}