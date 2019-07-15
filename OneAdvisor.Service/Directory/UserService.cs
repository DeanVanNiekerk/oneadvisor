using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using OneAdvisor.Data;
using OneAdvisor.Data.Entities.Directory;
using OneAdvisor.Model.Common;
using OneAdvisor.Model.Directory.Interface;
using OneAdvisor.Model.Account.Model.Authentication;
using OneAdvisor.Model.Directory.Model.User;
using OneAdvisor.Service.Common.Query;
using OneAdvisor.Model;
using OneAdvisor.Service.Directory.Validators;
using System.Collections.Generic;
using FluentValidation.Results;

namespace OneAdvisor.Service.Directory
{
    public class UserService : IUserService
    {
        private readonly DataContext _context;
        private readonly UserManager<UserEntity> _userManager;

        public UserService(DataContext context, UserManager<UserEntity> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        public async Task<PagedItems<User>> GetUsers(UserQueryOptions queryOptions)
        {
            var query = from user in ScopeQuery.GetUserEntityQuery(_context, queryOptions.Scope)
                        join branch in _context.Branch
                            on user.BranchId equals branch.Id
                        join organisation in _context.Organisation
                            on branch.OrganisationId equals organisation.Id
                        select new User()
                        {
                            Id = user.Id,
                            FirstName = user.FirstName,
                            LastName = user.LastName,
                            Email = user.Email,
                            UserName = user.UserName,
                            BranchId = user.BranchId,
                            BranchName = branch.Name,
                            OrganisationId = organisation.Id,
                            OrganisationName = organisation.Name,
                            Scope = user.Scope,
                            EmailConfirmed = user.EmailConfirmed,
                            LockoutEnd = user.LockoutEnd
                        };

            //Apply filters ----------------------------------------------------------------------------------------
            if (!string.IsNullOrWhiteSpace(queryOptions.FirstName))
                query = query.Where(m => EF.Functions.Like(m.FirstName, queryOptions.FirstName));

            if (!string.IsNullOrWhiteSpace(queryOptions.LastName))
                query = query.Where(m => EF.Functions.Like(m.LastName, queryOptions.LastName));

            if (!string.IsNullOrWhiteSpace(queryOptions.Email))
                query = query.Where(m => EF.Functions.Like(m.Email, queryOptions.Email));

            if (queryOptions.EmailConfirmed.HasValue)
                query = query.Where(m => m.EmailConfirmed == queryOptions.EmailConfirmed);

            if (queryOptions.OrganisationId.Any())
                query = query.Where(m => queryOptions.OrganisationId.Contains(m.OrganisationId));

            if (queryOptions.BranchId.Any())
                query = query.Where(m => queryOptions.BranchId.Contains(m.BranchId));
            //------------------------------------------------------------------------------------------------------

            var pagedItems = new PagedItems<User>();

            //Get total items
            pagedItems.TotalItems = await query.CountAsync();

            //Ordering
            query = query.OrderBy(queryOptions.SortOptions.Column, queryOptions.SortOptions.Direction);

            //Paging
            pagedItems.Items = await query.TakePage(queryOptions.PageOptions.Number, queryOptions.PageOptions.Size).ToListAsync();

            return pagedItems;
        }

        public async Task<UserEdit> GetUser(ScopeOptions scope, Guid id)
        {
            var query = from entity in ScopeQuery.GetUserEntityQuery(_context, scope)
                        where entity.Id == id
                        select entity;

            var user = await query.FirstOrDefaultAsync();

            if (user == null)
                return null;

            return await LoadUserEditModel(user);
        }

        public async Task<UserEdit> GetUser(ScopeOptions scope, string userName)
        {
            var query = from entity in ScopeQuery.GetUserEntityQuery(_context, scope)
                        where entity.UserName == userName
                        select entity;

            var user = await query.FirstOrDefaultAsync();

            if (user == null)
                return null;

            return await LoadUserEditModel(user);
        }

        public async Task<UserEdit> LoadUserEditModel(UserEntity entity)
        {
            var model = MapEntityToModel(entity);
            model.Roles = await _userManager.GetRolesAsync(entity);
            model.IsLocked = await _userManager.IsLockedOutAsync(entity);

            return model;
        }

        public async Task<Result> InsertUser(ScopeOptions scope, UserEdit user)
        {
            return await InsertUser(scope, user, GenerateRandomPassword(_userManager.Options.Password), false);
        }

        public async Task<Result> InsertUser(ScopeOptions scope, UserEdit user, string password, bool emailConfirmed)
        {
            var validator = new UserValidator(_context, scope, true);
            var result = validator.Validate(user).GetResult();

            if (!result.Success)
                return result;

            var entity = MapModelToEntity(user);

            entity.EmailConfirmed = emailConfirmed;

            var createResult = await _userManager.CreateAsync(entity, password);
            result.Success = createResult.Succeeded;

            if (!result.Success)
            {
                result.ValidationFailures = createResult.Errors.Select(e => new ValidationFailure("", e.Description)).ToList();
                return result;
            }

            await UpdateRoles(entity, user.Roles);
            await UpdateIsLocked(entity, user.IsLocked);

            return result;
        }

        public async Task<Result> UpdateUser(ScopeOptions scope, UserEdit user)
        {
            var validator = new UserValidator(_context, scope, false);
            var result = validator.Validate(user).GetResult();

            if (!result.Success)
                return result;

            var entity = await ScopeQuery.GetUserEntityQuery(_context, scope).FirstOrDefaultAsync(m => m.Id == user.Id);

            if (entity == null)
                return new Result();

            var userEntity = MapModelToEntity(user, entity);

            var updateResult = await _userManager.UpdateAsync(entity);

            result.Success = updateResult.Succeeded;

            if (!result.Success)
            {
                result.ValidationFailures = updateResult.Errors.Select(e => new ValidationFailure("", e.Description)).ToList();
                return result;
            }

            await UpdateRoles(entity, user.Roles);
            await UpdateIsLocked(entity, user.IsLocked);

            return result;
        }

        private async Task UpdateRoles(UserEntity entity, IEnumerable<string> roles)
        {
            //Update roles
            var currentRoles = await _userManager.GetRolesAsync(entity);
            await _userManager.RemoveFromRolesAsync(entity, currentRoles);
            await _userManager.AddToRolesAsync(entity, roles);
        }

        private async Task UpdateIsLocked(UserEntity entity, bool isLocked)
        {
            var isCurrentlyLocked = await _userManager.IsLockedOutAsync(entity);

            if (isCurrentlyLocked && !isLocked)
                await _userManager.SetLockoutEndDateAsync(entity, null);

            if (!isCurrentlyLocked && isLocked)
                await _userManager.SetLockoutEndDateAsync(entity, DateTime.MaxValue);
        }

        private UserEntity MapModelToEntity(UserEdit model, UserEntity entity = null)
        {
            if (entity == null)
                entity = new UserEntity();

            entity.FirstName = model.FirstName;
            entity.LastName = model.LastName;
            entity.Email = model.Email;
            entity.UserName = model.UserName;
            entity.BranchId = model.BranchId.Value;
            entity.Scope = model.Scope;
            entity.Aliases = model.Aliases;

            return entity;
        }

        private UserEdit MapEntityToModel(UserEntity entity)
        {
            var model = new UserEdit();

            model.Id = entity.Id;
            model.FirstName = entity.FirstName;
            model.LastName = entity.LastName;
            model.Email = entity.Email;
            model.UserName = entity.UserName;
            model.BranchId = entity.BranchId;
            model.Scope = entity.Scope;
            model.Aliases = entity.Aliases;

            return model;
        }

        public async Task<PagedItems<UserSimple>> GetUsersSimple(ScopeOptions scope)
        {
            var query = GetUserSimpleQuery(scope);

            var pagedItems = new PagedItems<UserSimple>();

            //Get total items
            pagedItems.TotalItems = await query.CountAsync();

            //Ordering
            query = query.OrderBy("LastName", SortDirection.Ascending);

            pagedItems.Items = await query.ToListAsync();

            return pagedItems;
        }

        public Task<UserSimple> GetUserSimple(ScopeOptions scope, Guid id)
        {
            return GetUserSimpleQuery(scope).FirstOrDefaultAsync(u => u.Id == id);
        }

        private IQueryable<UserSimple> GetUserSimpleQuery(ScopeOptions scope)
        {
            var query = from user in ScopeQuery.GetUserEntityQuery(_context, scope)
                        select new UserSimple()
                        {
                            Id = user.Id,
                            FirstName = user.FirstName,
                            LastName = user.LastName,
                            BranchId = user.BranchId
                        };

            return query;
        }

        private string GenerateRandomPassword(PasswordOptions options = null)
        {
            if (options == null) options = new PasswordOptions()
            {
                RequiredLength = 8,
                RequiredUniqueChars = 4,
                RequireDigit = true,
                RequireLowercase = true,
                RequireNonAlphanumeric = true,
                RequireUppercase = true
            };

            string[] randomChars = new[] {
            "ABCDEFGHJKLMNOPQRSTUVWXYZ",    // uppercase 
            "abcdefghijkmnopqrstuvwxyz",    // lowercase
            "0123456789",                   // digits
            "!@$?_-"                        // non-alphanumeric
        };

            Random rand = new Random(Environment.TickCount);
            List<char> chars = new List<char>();

            if (options.RequireUppercase)
                chars.Insert(rand.Next(0, chars.Count),
                    randomChars[0][rand.Next(0, randomChars[0].Length)]);

            if (options.RequireLowercase)
                chars.Insert(rand.Next(0, chars.Count),
                    randomChars[1][rand.Next(0, randomChars[1].Length)]);

            if (options.RequireDigit)
                chars.Insert(rand.Next(0, chars.Count),
                    randomChars[2][rand.Next(0, randomChars[2].Length)]);

            if (options.RequireNonAlphanumeric)
                chars.Insert(rand.Next(0, chars.Count),
                    randomChars[3][rand.Next(0, randomChars[3].Length)]);

            for (int i = chars.Count; i < options.RequiredLength
                || chars.Distinct().Count() < options.RequiredUniqueChars; i++)
            {
                string rcs = randomChars[rand.Next(0, randomChars.Length)];
                chars.Insert(rand.Next(0, chars.Count),
                    rcs[rand.Next(0, rcs.Length)]);
            }

            return new string(chars.ToArray());
        }

    }
}