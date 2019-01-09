using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using OneAdvisor.Data;
using OneAdvisor.Model.Directory.Interface;
using OneAdvisor.Model.Directory.Model.Auth;
using OneAdvisor.Model.Directory.Model.Role;
using OneAdvisor.Model.Directory.Model.User;

namespace OneAdvisor.Service.Directory
{
    public class AuthService : IAuthService
    {
        private readonly DataContext _context;

        public AuthService(DataContext context)
        {
            _context = context;
        }

        public async Task<ScopeOptions> GetScope(string userId, Scope scope)
        {
            var userDetails = await (from user in _context.User
                                     join branch in _context.Branch
                                        on user.BranchId equals branch.Id
                                     where user.Id == userId
                                     select new
                                     {
                                         BranchId = user.BranchId,
                                         OrganisationId = branch.OrganisationId
                                     }).FirstOrDefaultAsync();

            return new ScopeOptions(userDetails.OrganisationId, userDetails.BranchId, userId, scope);
        }
    }
}