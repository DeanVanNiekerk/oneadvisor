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
            total += await _context.Database.ExecuteSqlCommandAsync("TRUNCATE TABLE [dir_RoleToUseCase]");
            total += await _context.Database.ExecuteSqlCommandAsync("TRUNCATE TABLE [dir_UseCase]");
            total += await _context.Database.ExecuteSqlCommandAsync("TRUNCATE TABLE [dir_Role]");

            return total;
        }

        public async Task Seed()
        {
            var dirGuid = Guid.Parse("66c3b4e8-8a30-4a4b-be4d-3928d12fefe9");
            var memGuid = Guid.Parse("605ea52c-3627-48e2-8f7c-4819c5ea555b");
            var hpaGuid = Guid.Parse("2dc6f9ac-728b-4e19-9d72-0bad5fc84a03");

            var application = await _context.Application.FindAsync(dirGuid);
            if(application == null)
                _context.Application.Add(new ApplicationEntity() { Id = dirGuid, Name = "Directory" });

            application = await _context.Application.FindAsync(memGuid);
            if(application == null)
                _context.Application.Add(new ApplicationEntity() { Id = memGuid, Name = "Member" });

            application = await _context.Application.FindAsync(hpaGuid);
            if(application == null)
                _context.Application.Add(new ApplicationEntity() { Id = hpaGuid, Name = "Health" });

            var roles = _context.Role.ToList();
            if(!roles.Any()) {

                //Directory Roles
                _context.Role.Add(new RoleEntity() { Id = "dir_super_administrator", Name = "Super Administrator", ApplicationId = dirGuid });


                //Health Plan Advisor Roles
                _context.Role.Add(new RoleEntity() { Id = "hpa_administrator", Name = "Administrator", ApplicationId = hpaGuid });
                _context.Role.Add(new RoleEntity() { Id = "hpa_broker", Name = "Broker", ApplicationId = hpaGuid });
                _context.Role.Add(new RoleEntity() { Id = "hpa_membermanager", Name = "Member Manager", ApplicationId = hpaGuid });
                _context.Role.Add(new RoleEntity() { Id = "hpa_reportviewer", Name = "Report Viewer", ApplicationId = hpaGuid });
            }

            var useCases = _context.UseCase.ToList();
            if(!useCases.Any()) {

                //Directory Use Cases
                _context.UseCase.Add(new UseCaseEntity() { Id = "dir_view_users", Name = "View Users", ApplicationId = dirGuid });
            }

            var roleToUseCase = _context.RoleToUseCase.ToList();
            if(!roleToUseCase.Any()) {

                //Directory Use Cases
                _context.RoleToUseCase.Add(new RoleToUseCaseEntity() { RoleId = "dir_super_administrator", UseCaseId = "dir_view_users" });
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