using System;
using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;
using OneAdvisor.Data;
using OneAdvisor.Model.Common;
using OneAdvisor.Model.Directory.Interface;
using OneAdvisor.Model.Directory.Model.UserAlias;
using Microsoft.EntityFrameworkCore;
using OneAdvisor.Data.Entities.Directory;
using OneAdvisor.Model;
using OneAdvisor.Service.Directory.Validators;
using OneAdvisor.Model.Directory.Model.Auth;
using OneAdvisor.Service.Common.Query;

namespace OneAdvisor.Service.Directory
{
    public class UserAliasService : IUserAliasService
    {
        private readonly DataContext _context;

        public UserAliasService(DataContext context)
        {
            _context = context;
        }

        public async Task<PagedItems<UserAlias>> GetUserAliases(UserAliasQueryOptions queryOptions)
        {
            var query = GetUserAliasQuery(queryOptions.Scope);

            //Get total before applying filters
            var pagedItems = new PagedItems<UserAlias>();
            pagedItems.TotalItems = await query.CountAsync();

            //Apply filters ----------------------------------------------------------------------------------------
            if (!string.IsNullOrEmpty(queryOptions.UserId))
                query = query.Where(b => b.UserId == queryOptions.UserId);
            //------------------------------------------------------------------------------------------------------

            //Ordering
            query = query.OrderBy(queryOptions.SortOptions.Column, queryOptions.SortOptions.Direction);

            //Paging
            pagedItems.Items = await query.TakePage(queryOptions.PageOptions.Number, queryOptions.PageOptions.Size).ToListAsync();

            return pagedItems;
        }

        public async Task<UserAlias> GetUserAlias(ScopeOptions scope, Guid id)
        {
            var query = from alias in GetUserAliasQuery(scope)
                        where alias.Id == id
                        select alias;
            return await query.FirstOrDefaultAsync();
        }

        public async Task<Result> InsertUserAlias(ScopeOptions scope, UserAlias alias)
        {
            var validator = new UserAliasValidator(true);
            var result = validator.Validate(alias).GetResult();

            if (!result.Success)
                return result;

            result = await ScopeQuery.IsUserInScopeResult(_context, scope, alias.UserId);

            if (!result.Success)
                return result;

            var entity = MapModelToEntity(alias);
            entity.UserId = alias.UserId;

            await _context.UserAlias.AddAsync(entity);
            await _context.SaveChangesAsync();

            alias.Id = entity.Id;
            result.Tag = alias;

            return result;
        }

        public async Task<Result> UpdateUserAlias(ScopeOptions scope, UserAlias alias)
        {
            var validator = new UserAliasValidator(false);
            var result = validator.Validate(alias).GetResult();

            if (!result.Success)
                return result;

            var entity = await _context.UserAlias.FindAsync(alias.Id);

            result = await ScopeQuery.IsUserInScopeResult(_context, scope, entity.UserId);

            if (!result.Success)
                return result;

            entity = MapModelToEntity(alias, entity);
            await _context.SaveChangesAsync();

            return result;
        }

        private IQueryable<UserAlias> GetUserAliasQuery(ScopeOptions scope)
        {
            var query = from user in ScopeQuery.GetUserEntityQuery(_context, scope)
                        join alias in _context.UserAlias
                            on user.Id equals alias.UserId
                        select new UserAlias()
                        {
                            Id = alias.Id,
                            UserId = alias.UserId,
                            Name = alias.Name
                        };

            return query;
        }

        private UserAliasEntity MapModelToEntity(UserAlias model, UserAliasEntity entity = null)
        {
            if (entity == null)
                entity = new UserAliasEntity();

            entity.Id = model.Id;
            entity.Name = model.Name;

            return entity;
        }
    }
}