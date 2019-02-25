using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using OneAdvisor.Data;
using OneAdvisor.Data.Entities.Directory;
using OneAdvisor.Model.Common;
using OneAdvisor.Model.Directory.Interface;
using OneAdvisor.Model.Directory.Model.Authentication;
using OneAdvisor.Model.Directory.Model.User;
using OneAdvisor.Service.Common.Query;
using OneAdvisor.Model;
using OneAdvisor.Service.Directory.Validators;
using System.Collections.Generic;

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

        public Task<UserEdit> GetUser(ScopeOptions scope, Guid id)
        {
            //TODO: fix
            throw new System.NotImplementedException();
        }

        public async Task<PagedItems<User>> GetUsers(UserQueryOptions queryOptions)
        {
            var query = from user in ScopeQuery.GetUserEntityQuery(_context, queryOptions.Scope)
                        join branch in _context.Branch
                            on user.BranchId equals branch.Id
                        select new User()
                        {
                            Id = user.Id,
                            FirstName = user.FirstName,
                            LastName = user.LastName,
                            Email = user.Email,
                            BranchId = user.BranchId,
                            Login = user.UserName,
                            OrganisationId = branch.Id,
                            Scope = user.Scope,
                            Aliases = user.Aliases
                        };

            //Apply filters ----------------------------------------------------------------------------------------
            //if (!string.IsNullOrWhiteSpace(queryOptions.FirstName))
            ///    query = query.Where(m => EF.Functions.Like(m.FirstName, queryOptions.FirstName));
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

        public async Task<Result> InsertUser(ScopeOptions scope, UserEdit user, string password)
        {
            var validator = new UserValidator(scope, true);
            var result = validator.Validate(user).GetResult();

            if (!result.Success)
                return result;

            //TODO: CHECK SCOPE

            var entity = MapModelToEntity(user);

            entity.EmailConfirmed = true;

            var createResult = await _userManager.CreateAsync(entity, password);

            result.Success = createResult.Succeeded;

            if (!result.Success)
            {
                //TODO: Map errors
                return result;
            }

            await UpdateRoles(entity, user.Roles);

            user.Id = entity.Id;
            result.Tag = user;

            return result;
        }

        private async Task UpdateRoles(UserEntity entity, IEnumerable<string> roles)
        {
            //Update roles
            var currentRoles = await _userManager.GetRolesAsync(entity);
            await _userManager.RemoveFromRolesAsync(entity, currentRoles);
            await _userManager.AddToRolesAsync(entity, roles);
        }

        public async Task<Result> UpdateUser(ScopeOptions scope, UserEdit user)
        {
            var validator = new UserValidator(scope, false);
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
                //TODO: Map errors
                return result;
            }

            await UpdateRoles(entity, user.Roles);

            return result;
        }

        private UserEntity MapModelToEntity(UserEdit model, UserEntity entity = null)
        {
            if (entity == null)
                entity = new UserEntity();

            entity.FirstName = model.FirstName;
            entity.LastName = model.LastName;
            entity.Email = model.Email;
            entity.BranchId = model.BranchId.Value;
            entity.UserName = model.UserName;
            entity.Scope = model.Scope;
            entity.Aliases = model.Aliases;

            return entity;
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
                            LastName = user.LastName
                        };

            return query;
        }
    }
}