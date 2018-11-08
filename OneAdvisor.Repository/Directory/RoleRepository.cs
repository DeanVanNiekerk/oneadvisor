using System;
using System.Linq;
using System.Collections.Generic;
using OneAdvisor.Data;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using OneAdvisor.Model.Directory.Interface.Repository;

namespace OneAdvisor.Repository.Directory
{
    public class RoleRepository : IRoleRepository
    {
        private readonly DataContext _context;

        public RoleRepository(DataContext context)
        {
            _context = context;
        }

        public async Task<bool> HasUseCase(IEnumerable<string> roleIds, string useCase)
        {
            var query = from roleToUseCase in _context.RoleToUseCase
                        where roleToUseCase.UseCaseId == useCase
                        && roleIds.Contains(roleToUseCase.RoleId)
                        select roleToUseCase;

            return await query.AnyAsync();
        }
    }
}
