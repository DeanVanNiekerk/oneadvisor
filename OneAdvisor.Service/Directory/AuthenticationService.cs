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
using OneAdvisor.Model.Directory.Interface;
using OneAdvisor.Model.Directory.Model.Authentication;
using OneAdvisor.Model.Directory.Model.Role;
using OneAdvisor.Model.Directory.Model.User;

namespace OneAdvisor.Service.Directory
{
    public class AuthenticationService : IAuthenticationService
    {
        private readonly DataContext _context;
        private readonly UserManager<UserEntity> _userManager;

        public AuthenticationService(DataContext context, UserManager<UserEntity> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        public async Task<ScopeOptions> GetScope(string userId, bool ignoreScope = false)
        {
            var userDetails = await (from user in _context.User
                                     join branch in _context.Branch
                                        on user.BranchId equals branch.Id
                                     where user.Id == userId
                                     select new
                                     {
                                         Scope = user.Scope,
                                         BranchId = user.BranchId,
                                         OrganisationId = branch.OrganisationId
                                     }).FirstOrDefaultAsync();

            return new ScopeOptions(userDetails.OrganisationId, userDetails.BranchId, userId, userDetails.Scope, ignoreScope);
        }

        public async Task<AuthenticationResult> Authenticate(string userName, string password)
        {
            var result = new AuthenticationResult();

            var user = await _userManager.FindByNameAsync(userName);

            if (user == null)
                return result;

            result.Success = await _userManager.CheckPasswordAsync(user, password ?? "");

            return result;
        }

        public async Task<JwtSecurityToken> GenerateToken(string userName, JwtOptions options)
        {
            var user = await _userManager.FindByNameAsync(userName);

            //Generate and issue a JWT token
            var claims = new List<Claim>() {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var roles = await _userManager.GetRolesAsync(user);
            foreach (var role in roles)
                claims.Add(new Claim(ClaimTypes.Role, role));

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(options.Key));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
              issuer: options.Issuer,
              audience: options.Audience,
              claims: claims,
              expires: DateTime.Now.AddDays(30),
              signingCredentials: creds);

            return token;
        }
    }
}