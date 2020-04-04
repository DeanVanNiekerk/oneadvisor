using System;
using System.Collections.Generic;
using System.Dynamic;
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
using OneAdvisor.Model.Config.Options;
using OneAdvisor.Model.Directory.Interface;
using OneAdvisor.Model.Directory.Model.Audit;
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
        private readonly IAuditService _auditService;
        private readonly IRoleService _roleService;


        public AuthenticationService(DataContext context, UserManager<UserEntity> userManager, IUseCaseService useCaseService, IAuditService auditService, IRoleService roleService)
        {
            _context = context;
            _userManager = userManager;
            _useCaseService = useCaseService;
            _auditService = auditService;
            _roleService = roleService;
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

        public ScopeOptions GetIgnoreScope()
        {
            return new ScopeOptions(Guid.Empty, Guid.Empty, Guid.Empty, Scope.User, true);
        }

        public async Task<AuthenticationResult> Authenticate(string userName, string password)
        {
            var result = new AuthenticationResult();

            dynamic data = new ExpandoObject();
            data.success = false;
            data.userName = userName;
            data.message = "";

            var log = new AuditLog()
            {
                Action = "Authenticate",
                Entity = "User",
                Data = data,
            };

            var user = await _userManager.FindByNameAsync(userName);

            if (user == null)
            {
                log.Data.message = "Invalid username";
                await _auditService.InsertAuditLogStringId(null, log.Action, log.Entity, null, log.Data);
                return result;
            }

            log.UserId = user.Id;

            result.NotActivated = !user.EmailConfirmed;

            if (result.NotActivated)
            {
                log.Data.message = "Not activated";
                await _auditService.InsertAuditLogStringId(null, log.Action, log.Entity, null, log.Data);
                return result;
            }

            result.IsLocked = await _userManager.IsLockedOutAsync(user);

            if (result.IsLocked)
            {
                log.Data.message = "Locked";
                await _auditService.InsertAuditLogStringId(null, log.Action, log.Entity, null, log.Data);
                return result;
            }

            result.Success = await _userManager.CheckPasswordAsync(user, password ?? "");

            if (!result.Success)
            {
                log.Data.message = "Invalid password";
                await _auditService.InsertAuditLogStringId(null, log.Action, log.Entity, null, log.Data);
            }
            else
            {
                log.Data.success = true;
                var organisationId = (await _context.Branch.SingleAsync(o => o.Id == user.BranchId)).OrganisationId;
                await _auditService.InsertAuditLog(organisationId, user.BranchId, user.Id, log.Action, log.Entity, null, log.Data);
            }

            return result;
        }

        public async Task<string> GenerateToken(string userName, JwtOptions options)
        {
            return await GenerateToken(userName, null, options);
        }

        public async Task<string> GenerateToken(string userName, Guid? organisationId, JwtOptions options)
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

            var organisationIdClaim = userDetails.OrganisationId;
            var organisationNameClaim = userDetails.OrganisationName;
            var branchIdClaim = userDetails.BranchId;
            var branchNameClaim = userDetails.BranchName;

            //Organisation override is supplied, only for super admin
            if (organisationId.HasValue)
            {
                var uRoles = await _userManager.GetRolesAsync(user);

                if (uRoles.Any(r => r == Role.SUPER_ADMINISTRATOR_ROLE))
                {
                    var organisation = await _context.Organisation.Where(o => o.Id == organisationId).Include(o => o.Branches).FirstOrDefaultAsync();
                    if (organisation != null)
                    {
                        organisationIdClaim = organisation.Id;
                        organisationNameClaim = organisation.Name;

                        var branch = organisation.Branches.FirstOrDefault();
                        branchIdClaim = branch.Id;
                        branchNameClaim = branch.Name;
                    }

                }
            }

            //Generate and issue a JWT token
            var claims = new List<Claim>() {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(Claims.OrganisationIdClaimName, organisationIdClaim.ToString()),
                new Claim(Claims.BranchIdClaimName, branchIdClaim.ToString()),
                new Claim(Claims.ScopeClaimName, Enum.GetName(typeof(Scope), userDetails.Scope))
            };

            //Get organisation
            var org = await _context.Organisation.FindAsync(userDetails.OrganisationId);

            var roles = await _roleService.GetRoles();
            var userRoles = await _userManager.GetRolesAsync(user);
            var allowedRoles = roles.Where(r => org.Config.ApplicationIds.Any(id => id == r.ApplicationId));

            //Filter out any roles this organisation should have access to
            userRoles = userRoles.Where(r => allowedRoles.Any(ar => ar.Name == r) || r == Role.SUPER_ADMINISTRATOR_ROLE).ToList();

            foreach (var role in userRoles)
                claims.Add(new Claim(Claims.RolesClaimName, role));

            var useCases = await _useCaseService.GetUseCases(userRoles);
            foreach (var useCase in useCases)
                claims.Add(new Claim(Claims.UseCaseIdsClaimName, useCase));

            //Extra
            claims.Add(new Claim("email", user.Email));
            claims.Add(new Claim("userName", user.UserName));
            claims.Add(new Claim("firstName", user.FirstName));
            claims.Add(new Claim("lastName", user.LastName));
            claims.Add(new Claim("branchName", branchNameClaim));
            claims.Add(new Claim("organisationName", organisationNameClaim));

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(options.Secret));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256Signature);

            var tokenDescriptor = new SecurityTokenDescriptor()
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.Now.AddDays(options.LifeSpanDays),
                SigningCredentials = credentials
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        public async Task<Result> GeneratePasswordResetToken(string userName)
        {
            var result = new Result();

            var user = await _userManager.FindByNameAsync(userName);

            if (user == null)
                return result;

            result.Success = true;
            result.Tag = await _userManager.GeneratePasswordResetTokenAsync(user);

            return result;
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

                return result;
            }

            if (!user.EmailConfirmed)
            {
                user.EmailConfirmed = true;
                await _userManager.UpdateAsync(user);
            }

            return result;
        }
    }
}