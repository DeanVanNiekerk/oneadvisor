using System;
using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;
using OneAdvisor.Data;
using OneAdvisor.Model.Common;
using OneAdvisor.Model.Directory.Interface;
using OneAdvisor.Model.Directory.Model.Branch;
using Microsoft.EntityFrameworkCore;
using OneAdvisor.Data.Entities.Directory;
using OneAdvisor.Model;
using OneAdvisor.Service.Directory.Validators;
using OneAdvisor.Service.Common.Query;
using OneAdvisor.Model.Directory.Model.Auth;
using OneAdvisor.Model.Directory.Model.User;

namespace OneAdvisor.Service.Directory
{
    public class BranchService : IBranchService
    {
        private readonly DataContext _context;

        public BranchService(DataContext context)
        {
            _context = context;
        }

        public async Task<PagedItems<Branch>> GetBranches(BranchQueryOptions queryOptions)
        {
            var query = GetBranchQuery(queryOptions.Scope);

            //Apply filters ----------------------------------------------------------------------------------------
            if (queryOptions.OrganisationId.HasValue)
                query = query.Where(b => b.OrganisationId == queryOptions.OrganisationId);
            //------------------------------------------------------------------------------------------------------

            var pagedItems = new PagedItems<Branch>();

            //Get total items
            pagedItems.TotalItems = await query.CountAsync();

            //Ordering
            query = query.OrderBy(queryOptions.SortOptions.Column, queryOptions.SortOptions.Direction);

            //Paging
            pagedItems.Items = await query.TakePage(queryOptions.PageOptions.Number, queryOptions.PageOptions.Size).ToListAsync();

            return pagedItems;
        }

        public async Task<Branch> GetBranch(ScopeOptions scope, Guid id)
        {
            var query = from branch in GetBranchQuery(scope)
                        where branch.Id == id
                        select branch;
            return await query.FirstOrDefaultAsync();
        }

        public async Task<Result> InsertBranch(ScopeOptions scope, Branch branch)
        {
            var validator = new BranchValidator(true);
            var result = validator.Validate(branch).GetResult();

            if (!result.Success)
                return result;

            //Only organisation scope
            if (scope.Scope == Scope.Branch || scope.Scope == Scope.User)
                return new Result();

            if (!ScopeQuery.IsOrganisationInScope(scope, branch.OrganisationId.Value))
                return new Result();

            var entity = MapModelToEntity(branch);
            entity.OrganisationId = branch.OrganisationId.Value;
            await _context.Branch.AddAsync(entity);
            await _context.SaveChangesAsync();

            branch.Id = entity.Id;
            result.Tag = branch;

            return result;
        }

        public async Task<Result> UpdateBranch(ScopeOptions scope, Branch branch)
        {
            var validator = new BranchValidator(false);
            var result = validator.Validate(branch).GetResult();

            if (!result.Success)
                return result;

            if (scope.Scope == Scope.User)
                return new Result();

            var entity = await ScopeQuery.GetBranchEntityQuery(_context, scope).FirstOrDefaultAsync(b => b.Id == branch.Id);

            if (entity == null)
                return new Result();

            entity = MapModelToEntity(branch, entity);
            await _context.SaveChangesAsync();

            return result;
        }

        private IQueryable<Branch> GetBranchQuery(ScopeOptions scope)
        {
            var query = from branch in ScopeQuery.GetBranchEntityQuery(_context, scope)
                        select new Branch()
                        {
                            Id = branch.Id,
                            OrganisationId = branch.OrganisationId,
                            Name = branch.Name
                        };

            return query;
        }

        private BranchEntity MapModelToEntity(Branch model, BranchEntity entity = null)
        {
            if (entity == null)
                entity = new BranchEntity();

            entity.Name = model.Name;

            return entity;
        }
    }
}