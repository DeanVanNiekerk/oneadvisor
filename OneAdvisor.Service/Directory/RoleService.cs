using System;
using System.Linq;
using System.Collections.Generic;
using OneAdvisor.Data;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using OneAdvisor.Model.Directory.Interface;
using OneAdvisor.Model.Directory.Model.Role;

namespace OneAdvisor.Service.Directory
{
    public class RoleService : IRoleService
    {
        private readonly DataContext _context;

        public RoleService(DataContext context)
        {
            _context = context;
        }

        public Task<List<Role>> GetRoles()
        {
            var query = from role in _context.Roles
                        select new Role()
                        {
                            Id = role.Id,
                            Name = role.Name,
                            ApplicationId = role.ApplicationId
                        };

            return query.ToListAsync();
        }

        public async Task<bool> HasUseCase(IEnumerable<string> roles, IEnumerable<string> useCases)
        {
            var query = from roleToUseCase in _context.RoleToUseCase
                        join role in _context.Roles
                            on roleToUseCase.RoleId equals role.Id
                        where useCases.Contains(roleToUseCase.UseCaseId)
                        && roles.Contains(role.Name)
                        select roleToUseCase;

            return await query.AnyAsync();
        }

        public Task<RoleEdit> GetRole(string name)
        {
            var query = from role in _context.Roles
                        where role.Name == name
                        select new RoleEdit()
                        {
                            Id = role.Id,
                            Name = role.Name,
                            ApplicationId = role.ApplicationId,
                            UseCaseIds = role.RoleToUseCases.Select(u => u.UseCaseId)
                        };

            return query.FirstOrDefaultAsync();
        }
    }
}
