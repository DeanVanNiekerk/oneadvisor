using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using OneAdvisor.Data;
using OneAdvisor.Model.Directory.Interface;
using OneAdvisor.Model.Directory.Model.Auth;
using OneAdvisor.Model.Directory.Model.Role;

namespace OneAdvisor.Service.Directory
{
    public class AuthService : IAuthService
    {
        private readonly DataContext _context;

        public AuthService(DataContext context)
        {
            _context = context;
        }

        public async Task<Scope> GetScope(string userId, IEnumerable<string> roleIds, string branchUseCase, string organisationUseCase)
        {
            var scope = new Scope();

            if (roleIds.Any(r => r == Role.SUPER_ADMINISTRATOR_ROLE))
                return scope;

            var userDetails = await (from user in _context.User
                                     join branch in _context.Branch
                                        on user.BranchId equals branch.Id
                                     where user.Id == userId
                                     select new
                                     {
                                         BranchId = user.BranchId,
                                         OrganisationId = branch.OrganisationId
                                     }).FirstOrDefaultAsync();

            var useCases = await _context.RoleToUseCase.Where(rc => roleIds.Contains(rc.RoleId)).Select(rc => rc.UseCaseId).ToListAsync();

            if (useCases.Any(u => u == organisationUseCase))
                scope.OrganisationId = userDetails.OrganisationId;
            else if (useCases.Any(u => u == branchUseCase))
                scope.BranchId = userDetails.BranchId;
            else
                scope.UserId = userId;

            return scope;
        }
    }
}