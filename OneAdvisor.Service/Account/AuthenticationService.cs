using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using OneAdvisor.Data;
using OneAdvisor.Data.Entities.Directory;
using OneAdvisor.Model.Account.Interface;
using OneAdvisor.Model.Account.Model.Authentication;
using OneAdvisor.Model.Directory.Interface;
using OneAdvisor.Model.Directory.Model.Role;
using OneAdvisor.Model.Directory.Model.User;

namespace OneAdvisor.Service.Account
{
    public class AuthenticationService : IAuthenticationService
    {
        private readonly DataContext _context;
        private readonly UserManager<UserEntity> _userManager;
        private readonly IUseCaseService _useCaseService;

        private readonly string _organisationIdClaimName = "organisationId";
        private readonly string _branchIdClaimName = "branchId";
        private readonly string _scopeClaimName = "scope";

        public AuthenticationService(DataContext context, UserManager<UserEntity> userManager, IUseCaseService useCaseService)
        {
            _context = context;
            _userManager = userManager;
            _useCaseService = useCaseService;
        }

        public ScopeOptions GetScope(ClaimsPrincipal principle, bool ignoreScope = false)
        {
            var userId = Guid.Parse(principle.Identity.Name);
            var organisationId = Guid.Parse(principle.Claims.Single(c => c.Type == _organisationIdClaimName).Value);
            var branchId = Guid.Parse(principle.Claims.Single(c => c.Type == _organisationIdClaimName).Value);
            var scope = Enum.Parse<Scope>(principle.Claims.Single(c => c.Type == _scopeClaimName).Value);

            if (ignoreScope)
            {
                var roles = principle.Claims.Where(c => c.Type == ClaimTypes.Role).Select(c => c.Value);
                ignoreScope = roles.Any(r => r == Role.SUPER_ADMINISTRATOR_ROLE);
            }

            return new ScopeOptions(organisationId, branchId, userId, scope, ignoreScope);
        }

        public async Task<AuthenticationResult> Authenticate(string userName, string password)
        {
            var result = new AuthenticationResult();

            var user = await _userManager.FindByNameAsync(userName);

            if (user == null)
                return result;

            result.Success = await _userManager.CheckPasswordAsync(user, password ?? "");

            if (result.Success)
            {
                var roles = await _userManager.GetRolesAsync(user);
                var branch = await _context.Branch.FindAsync(user.BranchId);
                var organisation = await _context.Organisation.FindAsync(branch.OrganisationId);

                var identity = new Identity()
                {
                    UserId = user.Id,
                    BranchId = user.BranchId,
                    Email = user.Email,
                    Scope = user.Scope,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    Roles = roles,
                    UseCaseIds = await _useCaseService.GetUseCases(roles),
                    BranchName = branch.Name,
                    OrganisationId = organisation.Id,
                    OrganisationName = organisation.Name

                };
                result.Identity = identity;
            }

            return result;
        }

        public async Task<string> GenerateToken(string userName, JwtOptions options)
        {
            var user = await _userManager.FindByNameAsync(userName);

            var userDetails = await (from entity in _context.Users
                                     join branch in _context.Branch
                                        on entity.BranchId equals branch.Id
                                     where entity.Id == user.Id
                                     select new
                                     {
                                         Scope = entity.Scope,
                                         BranchId = entity.BranchId,
                                         OrganisationId = branch.OrganisationId
                                     }).FirstOrDefaultAsync();

            //Generate and issue a JWT token
            var claims = new List<Claim>() {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(_organisationIdClaimName, userDetails.OrganisationId.ToString()),
                new Claim(_branchIdClaimName, userDetails.BranchId.ToString()),
                new Claim(_scopeClaimName, Enum.GetName(typeof(Scope), userDetails.Scope))
            };

            var roles = await _userManager.GetRolesAsync(user);
            foreach (var role in roles)
                claims.Add(new Claim(ClaimTypes.Role, role));

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(options.Secret));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(

              claims: claims,
              expires: DateTime.Now.AddDays(options.LifeSpanDays),
              signingCredentials: creds);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}