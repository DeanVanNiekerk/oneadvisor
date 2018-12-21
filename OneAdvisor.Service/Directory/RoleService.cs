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
            var query = from role in _context.Role
                        select new Role()
                        {
                            Id = role.Id,
                            Name = role.Name,
                            ApplicationId = role.ApplicationId
                        };

            return query.ToListAsync();
        }

        public async Task<bool> HasUseCase(IEnumerable<string> roleIds, IEnumerable<string> useCases)
        {
            var query = from roleToUseCase in _context.RoleToUseCase
                        where useCases.Contains(roleToUseCase.UseCaseId)
                        && roleIds.Contains(roleToUseCase.RoleId)
                        select roleToUseCase;

            return await query.AnyAsync();
        }

        public Task<RoleEdit> GetRole(string id)
        {
            var query = from role in _context.Role
                        where role.Id == id
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
