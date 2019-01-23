using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using OneAdvisor.Data.Entities.Directory;
using OneAdvisor.Data.Entities.Directory.Lookup;
using OneAdvisor.Data.Entities.Member;

namespace OneAdvisor.Data
{
    public class DbInitializer : IDefaultDbContextInitializer
    {
        private readonly DataContext _context;

        public DbInitializer(DataContext context)
        {
            _context = context;
        }

        public async Task<int> Clean()
        {
            var total = 0;

            total += await _context.Database.ExecuteSqlCommandAsync("DELETE FROM [mem_Policy]");
            total += await _context.Database.ExecuteSqlCommandAsync("DELETE FROM [mem_Member]");

            total += await _context.Database.ExecuteSqlCommandAsync("DELETE FROM [dir_User]");
            total += await _context.Database.ExecuteSqlCommandAsync("DELETE FROM [dir_RoleToUseCase]");
            total += await _context.Database.ExecuteSqlCommandAsync("DELETE FROM [dir_UseCase]");
            total += await _context.Database.ExecuteSqlCommandAsync("DELETE FROM [dir_Role]");
            total += await _context.Database.ExecuteSqlCommandAsync("DELETE FROM [dir_Organisation]");
            total += await _context.Database.ExecuteSqlCommandAsync("DELETE FROM [dir_Branch]");

            total += await _context.Database.ExecuteSqlCommandAsync("DELETE FROM [lkp_Company]");
            total += await _context.Database.ExecuteSqlCommandAsync("DELETE FROM [lkp_CommissionType]");
            total += await _context.Database.ExecuteSqlCommandAsync("DELETE FROM [lkp_MarritalStatus]");

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

            //Lookups - Companies
            var commissionTypes = await _context.CommissionType.ToListAsync();
            if (!commissionTypes.Any())
            {
                _context.CommissionType.Add(new CommissionTypeEntity() { Id = comp1Guid, Name = "Gap Cover" });
                _context.CommissionType.Add(new CommissionTypeEntity() { Id = Guid.NewGuid(), Name = "Health" });
                _context.CommissionType.Add(new CommissionTypeEntity() { Id = Guid.NewGuid(), Name = "Investment Advice Fee" });
                _context.CommissionType.Add(new CommissionTypeEntity() { Id = Guid.NewGuid(), Name = "Investment Advice Fee" });
                _context.CommissionType.Add(new CommissionTypeEntity() { Id = Guid.NewGuid(), Name = "Investment Premium Fee" });
                _context.CommissionType.Add(new CommissionTypeEntity() { Id = Guid.NewGuid(), Name = "Investment PUFF New" });
                _context.CommissionType.Add(new CommissionTypeEntity() { Id = Guid.NewGuid(), Name = "Investment PUFF Old" });
                _context.CommissionType.Add(new CommissionTypeEntity() { Id = Guid.NewGuid(), Name = "Investment Upfront" });
                _context.CommissionType.Add(new CommissionTypeEntity() { Id = Guid.NewGuid(), Name = "Lapse" });
                _context.CommissionType.Add(new CommissionTypeEntity() { Id = Guid.NewGuid(), Name = "Life 2nd Years" });
                _context.CommissionType.Add(new CommissionTypeEntity() { Id = Guid.NewGuid(), Name = "Life New Business" });
                _context.CommissionType.Add(new CommissionTypeEntity() { Id = Guid.NewGuid(), Name = "Life PUFF" });
                _context.CommissionType.Add(new CommissionTypeEntity() { Id = Guid.NewGuid(), Name = "Premium Reduction" });
                _context.CommissionType.Add(new CommissionTypeEntity() { Id = Guid.NewGuid(), Name = "Group Scheme (Annual)" });
                _context.CommissionType.Add(new CommissionTypeEntity() { Id = Guid.NewGuid(), Name = "Group Scheme (Monthly)" });
                _context.CommissionType.Add(new CommissionTypeEntity() { Id = Guid.NewGuid(), Name = "Rewards Program" });
                _context.CommissionType.Add(new CommissionTypeEntity() { Id = Guid.NewGuid(), Name = "Short Term Insurance (Annual)" });
                _context.CommissionType.Add(new CommissionTypeEntity() { Id = Guid.NewGuid(), Name = "Short Term Insurance (Monthly)" });
            }
        }

        public async Task Seed()
        {
            await SeedLookups();

            var dirGuid = Guid.Parse("66c3b4e8-8a30-4a4b-be4d-3928d12fefe9");
            var memGuid = Guid.Parse("605ea52c-3627-48e2-8f7c-4819c5ea555b");
            var comGuid = Guid.Parse("2fca4500-9142-4940-aaf4-b18925c96d66");
            var hpaGuid = Guid.Parse("2dc6f9ac-728b-4e19-9d72-0bad5fc84a03");

            var application = await _context.Application.FindAsync(dirGuid);
            if (application == null)
                _context.Application.Add(new ApplicationEntity() { Id = dirGuid, Name = "Directory" });

            application = await _context.Application.FindAsync(memGuid);
            if (application == null)
                _context.Application.Add(new ApplicationEntity() { Id = memGuid, Name = "Member" });

            application = await _context.Application.FindAsync(comGuid);
            if (application == null)
                _context.Application.Add(new ApplicationEntity() { Id = comGuid, Name = "Commission" });

            application = await _context.Application.FindAsync(hpaGuid);
            if (application == null)
                _context.Application.Add(new ApplicationEntity() { Id = hpaGuid, Name = "Health" });

            var roles = await _context.Role.ToListAsync();
            if (!roles.Any())
            {
                //Directory Roles
                _context.Role.Add(new RoleEntity() { Id = "dir_administrator", Name = "Administrator", ApplicationId = dirGuid });
                _context.Role.Add(new RoleEntity() { Id = "dir_readonly", Name = "Readonly", ApplicationId = dirGuid });

                //Member Roles
                _context.Role.Add(new RoleEntity() { Id = "mem_administrator", Name = "Administrator", ApplicationId = memGuid });
                _context.Role.Add(new RoleEntity() { Id = "mem_readonly", Name = "Readonly", ApplicationId = memGuid });

                //Commision Roles
                _context.Role.Add(new RoleEntity() { Id = "com_administrator", Name = "Administrator", ApplicationId = comGuid });
                _context.Role.Add(new RoleEntity() { Id = "com_readonly", Name = "Readonly", ApplicationId = comGuid });

                //Health Plan Advisor Roles
                _context.Role.Add(new RoleEntity() { Id = "hpa_administrator", Name = "Administrator", ApplicationId = hpaGuid });
                _context.Role.Add(new RoleEntity() { Id = "hpa_broker", Name = "Broker", ApplicationId = hpaGuid });
                _context.Role.Add(new RoleEntity() { Id = "hpa_membermanager", Name = "Member Manager", ApplicationId = hpaGuid });
                _context.Role.Add(new RoleEntity() { Id = "hpa_reportviewer", Name = "Report Viewer", ApplicationId = hpaGuid });
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

                //Directory - Lookup Use Cases
                _context.UseCase.Add(new UseCaseEntity() { Id = "dir_view_lookups", Name = "View Lookups", ApplicationId = dirGuid });
                _context.UseCase.Add(new UseCaseEntity() { Id = "dir_edit_lookups", Name = "Edit Lookups", ApplicationId = dirGuid });

                //Member Use Cases
                _context.UseCase.Add(new UseCaseEntity() { Id = "mem_view_members", Name = "View Members", ApplicationId = memGuid });
                _context.UseCase.Add(new UseCaseEntity() { Id = "mem_edit_members", Name = "Edit Members", ApplicationId = memGuid });
                _context.UseCase.Add(new UseCaseEntity() { Id = "mem_view_policies", Name = "View Policies", ApplicationId = memGuid });
                _context.UseCase.Add(new UseCaseEntity() { Id = "mem_edit_policies", Name = "Edit Policies", ApplicationId = memGuid });
                _context.UseCase.Add(new UseCaseEntity() { Id = "mem_import_members", Name = "Import Members", ApplicationId = memGuid });

                //Commission Use Cases
                _context.UseCase.Add(new UseCaseEntity() { Id = "com_upload_statement", Name = "Upload Commission Statement", ApplicationId = comGuid });
            }

            var roleToUseCase = await _context.RoleToUseCase.ToListAsync();
            if (!roleToUseCase.Any())
            {
                //Role to Use Case

                //Directory App
                //=============
                //Adminstrator 
                _context.RoleToUseCase.Add(new RoleToUseCaseEntity() { RoleId = "dir_administrator", UseCaseId = "dir_view_users" });
                _context.RoleToUseCase.Add(new RoleToUseCaseEntity() { RoleId = "dir_administrator", UseCaseId = "dir_edit_users" });
                _context.RoleToUseCase.Add(new RoleToUseCaseEntity() { RoleId = "dir_administrator", UseCaseId = "dir_view_organisations" });
                _context.RoleToUseCase.Add(new RoleToUseCaseEntity() { RoleId = "dir_administrator", UseCaseId = "dir_edit_organisations" });
                _context.RoleToUseCase.Add(new RoleToUseCaseEntity() { RoleId = "dir_administrator", UseCaseId = "dir_view_branches" });
                _context.RoleToUseCase.Add(new RoleToUseCaseEntity() { RoleId = "dir_administrator", UseCaseId = "dir_edit_branches" });
                _context.RoleToUseCase.Add(new RoleToUseCaseEntity() { RoleId = "dir_administrator", UseCaseId = "dir_view_roles" });
                _context.RoleToUseCase.Add(new RoleToUseCaseEntity() { RoleId = "dir_administrator", UseCaseId = "dir_view_applications" });
                _context.RoleToUseCase.Add(new RoleToUseCaseEntity() { RoleId = "dir_administrator", UseCaseId = "dir_view_usecases" });
                _context.RoleToUseCase.Add(new RoleToUseCaseEntity() { RoleId = "dir_administrator", UseCaseId = "dir_view_lookups" });
                _context.RoleToUseCase.Add(new RoleToUseCaseEntity() { RoleId = "dir_administrator", UseCaseId = "dir_edit_lookups" });

                //Readonly 
                _context.RoleToUseCase.Add(new RoleToUseCaseEntity() { RoleId = "dir_readonly", UseCaseId = "dir_view_users" });
                _context.RoleToUseCase.Add(new RoleToUseCaseEntity() { RoleId = "dir_readonly", UseCaseId = "dir_view_organisations" });
                _context.RoleToUseCase.Add(new RoleToUseCaseEntity() { RoleId = "dir_readonly", UseCaseId = "dir_view_branches" });
                _context.RoleToUseCase.Add(new RoleToUseCaseEntity() { RoleId = "dir_readonly", UseCaseId = "dir_view_roles" });
                _context.RoleToUseCase.Add(new RoleToUseCaseEntity() { RoleId = "dir_readonly", UseCaseId = "dir_view_applications" });
                _context.RoleToUseCase.Add(new RoleToUseCaseEntity() { RoleId = "dir_readonly", UseCaseId = "dir_view_usecases" });
                _context.RoleToUseCase.Add(new RoleToUseCaseEntity() { RoleId = "dir_readonly", UseCaseId = "dir_view_lookups" });
                //--------------------------------------------------------------------------------------------------------------------------------------------

                //Member App
                //==========
                //Adminstrator
                _context.RoleToUseCase.Add(new RoleToUseCaseEntity() { RoleId = "mem_administrator", UseCaseId = "mem_view_members" });
                _context.RoleToUseCase.Add(new RoleToUseCaseEntity() { RoleId = "mem_administrator", UseCaseId = "mem_edit_members" });
                _context.RoleToUseCase.Add(new RoleToUseCaseEntity() { RoleId = "mem_administrator", UseCaseId = "mem_import_members" });
                _context.RoleToUseCase.Add(new RoleToUseCaseEntity() { RoleId = "mem_administrator", UseCaseId = "mem_view_policies" });
                _context.RoleToUseCase.Add(new RoleToUseCaseEntity() { RoleId = "mem_administrator", UseCaseId = "mem_edit_policies" });

                //Readonly
                _context.RoleToUseCase.Add(new RoleToUseCaseEntity() { RoleId = "mem_readonly", UseCaseId = "mem_view_members" });
                _context.RoleToUseCase.Add(new RoleToUseCaseEntity() { RoleId = "mem_readonly", UseCaseId = "mem_view_policies" });
                //--------------------------------------------------------------------------------------------------------------------------------------------

                //Commission App
                //==============
                //Adminstrator
                _context.RoleToUseCase.Add(new RoleToUseCaseEntity() { RoleId = "com_administrator", UseCaseId = "com_upload_statement" });
                //--------------------------------------------------------------------------------------------------------------------------------------------
            }

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
                _context.Branch.Add(new BranchEntity() { Id = Guid.Parse("cfaa7bf4-bff8-4c8c-b71e-f64bd8249750"), OrganisationId = sabOrgId, Name = "Port Shepstone" });
                _context.Branch.Add(new BranchEntity() { Id = peBranchId, OrganisationId = sabOrgId, Name = "Port Elizabeth" });
                _context.Branch.Add(new BranchEntity() { Id = Guid.Parse("7ab8bcd9-0544-4613-a82e-06b6de99d7ac"), OrganisationId = lifeOrgId, Name = "Durban" });
            }

            //Members
            var members = await _context.Member.ToListAsync();
            if (!members.Any())
            {
                var mem1Guid = Guid.NewGuid();
                _context.Member.Add(new MemberEntity() { Id = mem1Guid, FirstName = "Andrew", LastName = "Blakeway", OrganisationId = sabOrgId });
            }

            _context.SaveChanges();
        }
    }

    public interface IDefaultDbContextInitializer
    {
        Task Seed();
        Task SeedLookups();
        Task<int> Clean();
    }

}