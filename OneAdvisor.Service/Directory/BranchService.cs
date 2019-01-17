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
            var query = GetBranchQuery();

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

        public async Task<Branch> GetBranch(Guid id)
        {
            var query = from branch in GetBranchQuery()
                        where branch.Id == id
                        select branch;
            return await query.FirstOrDefaultAsync();
        }

        public async Task<Result> InsertBranch(Branch branch)
        {
            var validator = new BranchValidator(true);
            var result = validator.Validate(branch).GetResult();

            if (!result.Success)
                return result;

            var entity = MapModelToEntity(branch);
            entity.OrganisationId = branch.OrganisationId;
            await _context.Branch.AddAsync(entity);
            await _context.SaveChangesAsync();

            branch.Id = entity.Id;
            result.Tag = branch;

            return result;
        }

        public async Task<Result> UpdateBranch(Branch branch)
        {
            var validator = new BranchValidator(false);
            var result = validator.Validate(branch).GetResult();

            if (!result.Success)
                return result;

            var entity = await _context.Branch.FindAsync(branch.Id);

            entity = MapModelToEntity(branch, entity);
            await _context.SaveChangesAsync();

            return result;
        }

        private IQueryable<Branch> GetBranchQuery()
        {
            var query = from branch in _context.Branch
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

            entity.Id = model.Id;
            entity.Name = model.Name;

            return entity;
        }
    }
}