using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using OneAdvisor.Data.Entities.Directory;

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
            total += await _context.Database.ExecuteSqlCommandAsync("DELETE FROM [dir_RoleToUseCase]");
            total += await _context.Database.ExecuteSqlCommandAsync("DELETE FROM [dir_UseCase]");
            total += await _context.Database.ExecuteSqlCommandAsync("DELETE FROM [dir_Role]");
            total += await _context.Database.ExecuteSqlCommandAsync("DELETE FROM [dir_Organisation]");
            total += await _context.Database.ExecuteSqlCommandAsync("DELETE FROM [dir_Branch]");

            total += await _context.Database.ExecuteSqlCommandAsync("DELETE FROM [mem_Member]");

            return total;
        }

        public async Task Seed()
        {
            var dirGuid = Guid.Parse("66c3b4e8-8a30-4a4b-be4d-3928d12fefe9");
            var memGuid = Guid.Parse("605ea52c-3627-48e2-8f7c-4819c5ea555b");
            var hpaGuid = Guid.Parse("2dc6f9ac-728b-4e19-9d72-0bad5fc84a03");

            var application = await _context.Application.FindAsync(dirGuid);
            if (application == null)
                _context.Application.Add(new ApplicationEntity() { Id = dirGuid, Name = "Directory" });

            application = await _context.Application.FindAsync(memGuid);
            if (application == null)
                _context.Application.Add(new ApplicationEntity() { Id = memGuid, Name = "Member" });

            application = await _context.Application.FindAsync(hpaGuid);
            if (application == null)
                _context.Application.Add(new ApplicationEntity() { Id = hpaGuid, Name = "Health" });

            var roles = _context.Role.ToList();
            if (!roles.Any())
            {

                //Directory Roles
                _context.Role.Add(new RoleEntity() { Id = "dir_administrator", Name = "Administrator", ApplicationId = dirGuid });

                //Member Roles
                _context.Role.Add(new RoleEntity() { Id = "mem_administrator", Name = "Administrator", ApplicationId = memGuid });


                //Health Plan Advisor Roles
                _context.Role.Add(new RoleEntity() { Id = "hpa_administrator", Name = "Administrator", ApplicationId = hpaGuid });
                _context.Role.Add(new RoleEntity() { Id = "hpa_broker", Name = "Broker", ApplicationId = hpaGuid });
                _context.Role.Add(new RoleEntity() { Id = "hpa_membermanager", Name = "Member Manager", ApplicationId = hpaGuid });
                _context.Role.Add(new RoleEntity() { Id = "hpa_reportviewer", Name = "Report Viewer", ApplicationId = hpaGuid });
            }

            var useCases = _context.UseCase.ToList();
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

                //Member Use Cases
                _context.UseCase.Add(new UseCaseEntity() { Id = "mem_view_members", Name = "View Members", ApplicationId = memGuid });
                _context.UseCase.Add(new UseCaseEntity() { Id = "mem_edit_members", Name = "Edit Members", ApplicationId = memGuid });
            }

            var roleToUseCase = _context.RoleToUseCase.ToList();
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
                //--------------------------------------------------------------------------------------------------------------------------------------------

                //Member App
                //==========
                //Adminstrator 
                _context.RoleToUseCase.Add(new RoleToUseCaseEntity() { RoleId = "mem_administrator", UseCaseId = "mem_view_members" });
                _context.RoleToUseCase.Add(new RoleToUseCaseEntity() { RoleId = "mem_administrator", UseCaseId = "mem_edit_members" });
                //--------------------------------------------------------------------------------------------------------------------------------------------
            }

            var organisations = _context.Organisation.ToList();
            var sabOrgId = Guid.Parse("9a46c5ae-3f6f-494c-b0de-d908f08507c3");
            var lifeOrgId = Guid.Parse("d44abb82-9eab-47a3-b20c-61b4ee93bf21");
            if (!organisations.Any())
            {
                //Organisations
                _context.Organisation.Add(new OrganisationEntity() { Id = sabOrgId, Name = "Smith and Bormann" });
                _context.Organisation.Add(new OrganisationEntity() { Id = lifeOrgId, Name = "Life Brokers" });
            }

            var branches = _context.Branch.ToList();
            if (!branches.Any())
            {
                //Branches
                _context.Branch.Add(new BranchEntity() { OrganisationId = sabOrgId, Name = "Port Shepstone" });
                _context.Branch.Add(new BranchEntity() { OrganisationId = sabOrgId, Name = "Port Elizabeth" });
                _context.Branch.Add(new BranchEntity() { OrganisationId = lifeOrgId, Name = "Durban" });
            }

            _context.SaveChanges();
        }
    }

    public interface IDefaultDbContextInitializer
    {
        Task Seed();
        Task<int> Clean();
    }

}