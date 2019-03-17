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
using OneAdvisor.Model;
using OneAdvisor.Model.Account.Interface;
using OneAdvisor.Model.Account.Model.Account;
using OneAdvisor.Model.Account.Model.Authentication;
using OneAdvisor.Model.Common;
using OneAdvisor.Model.Directory.Interface;
using OneAdvisor.Model.Directory.Model.Role;
using OneAdvisor.Model.Directory.Model.User;
using OneAdvisor.Service.Account.Validators;

namespace OneAdvisor.Service.Account
{
    public class AuthenticationService : IAuthenticationService
    {
        private readonly DataContext _context;
        private readonly UserManager<UserEntity> _userManager;
        private readonly IUseCaseService _useCaseService;


        public AuthenticationService(DataContext context, UserManager<UserEntity> userManager, IUseCaseService useCaseService)
        {
            _context = context;
            _userManager = userManager;
            _useCaseService = useCaseService;
        }

        public ScopeOptions GetScope(ClaimsPrincipal principle, bool ignoreScope = false)
        {
            var userId = Guid.Parse(principle.Identity.Name);
            var organisationId = Guid.Parse(principle.Claims.Single(c => c.Type == Claims.OrganisationIdClaimName).Value);
            var branchId = Guid.Parse(principle.Claims.Single(c => c.Type == Claims.BranchIdClaimName).Value);
            var scope = Enum.Parse<Scope>(principle.Claims.Single(c => c.Type == Claims.ScopeClaimName).Value);

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

            return result;
        }

        public async Task<string> GenerateToken(string userName, JwtOptions options)
        {
            var user = await _userManager.FindByNameAsync(userName);

            var userDetails = await (from entity in _context.Users
                                     join branch in _context.Branch
                                        on entity.BranchId equals branch.Id
                                     join organisation in _context.Organisation
                                        on branch.OrganisationId equals organisation.Id
                                     where entity.Id == user.Id
                                     select new
                                     {
                                         Scope = entity.Scope,
                                         BranchId = entity.BranchId,
                                         BranchName = branch.Name,
                                         OrganisationId = branch.OrganisationId,
                                         OrganisationName = organisation.Name
                                     }).FirstOrDefaultAsync();

            //Generate and issue a JWT token
            var claims = new List<Claim>() {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(Claims.OrganisationIdClaimName, userDetails.OrganisationId.ToString()),
                new Claim(Claims.BranchIdClaimName, userDetails.BranchId.ToString()),
                new Claim(Claims.ScopeClaimName, Enum.GetName(typeof(Scope), userDetails.Scope))
            };

            var roles = await _userManager.GetRolesAsync(user);
            foreach (var role in roles)
                claims.Add(new Claim(ClaimTypes.Role, role));

            var useCases = await _useCaseService.GetUseCases(roles);
            foreach (var useCase in useCases)
                claims.Add(new Claim(Claims.UseCaseIdsClaimName, useCase));

            //Extra
            claims.Add(new Claim("email", user.Email));
            claims.Add(new Claim("userName", user.UserName));
            claims.Add(new Claim("firstName", user.FirstName));
            claims.Add(new Claim("lastName", user.LastName));
            claims.Add(new Claim("branchName", userDetails.BranchName));
            claims.Add(new Claim("organisationName", userDetails.OrganisationName));

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(options.Secret));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(

              claims: claims,
              expires: DateTime.Now.AddDays(options.LifeSpanDays),
              signingCredentials: creds);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public async Task<string> GeneratePasswordResetToken(string userName)
        {
            var user = await _userManager.FindByNameAsync(userName);

            return await _userManager.GeneratePasswordResetTokenAsync(user);
        }

        public async Task<bool> IsUserActive(string userName)
        {
            var user = await _userManager.FindByNameAsync(userName);

            if (user == null)
                return false;

            return user.EmailConfirmed;
        }

        public async Task<Result> ResetPassword(ResetPassword resetPassword)
        {
            var validator = new ResetPasswordValidator();
            var result = validator.Validate(resetPassword).GetResult();

            if (!result.Success)
                return result;

            var user = await _userManager.FindByNameAsync(resetPassword.UserName);
            var activateResult = await _userManager.ResetPasswordAsync(user, resetPassword.Token, resetPassword.Password);

            if (!activateResult.Succeeded)
            {
                foreach (var error in activateResult.Errors)
                    result.AddValidationFailure("", error.Description);
            }

            return result;
        }
    }
}