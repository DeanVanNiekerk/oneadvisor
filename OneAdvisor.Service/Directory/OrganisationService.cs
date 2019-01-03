using System;
using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;
using OneAdvisor.Data;
using OneAdvisor.Model.Common;
using OneAdvisor.Model.Directory.Interface;
using OneAdvisor.Model.Directory.Model.Organisation;
using Microsoft.EntityFrameworkCore;
using OneAdvisor.Data.Entities.Directory;
using OneAdvisor.Model;
using OneAdvisor.Service.Directory.Validators;

namespace OneAdvisor.Service.Directory
{
    public class OrganisationService : IOrganisationService
    {
        private readonly DataContext _context;

        public OrganisationService(DataContext context)
        {
            _context = context;
        }

        public async Task<PagedItems<Organisation>> GetOrganisations(OrganisationQueryOptions queryOptions)
        {
            var query = GetOrganisationQuery();

            //Get total before applying filters
            var pagedItems = new PagedItems<Organisation>();
            pagedItems.TotalItems = await query.CountAsync();

            //Ordering
            query = query.OrderBy(queryOptions.SortOptions.Column, queryOptions.SortOptions.Direction);

            //Paging
            pagedItems.Items = await query.TakePage(queryOptions.PageOptions.Number, queryOptions.PageOptions.Size).ToListAsync();

            return pagedItems;
        }

        public async Task<Organisation> GetOrganisation(Guid id)
        {
            var query = from organisation in GetOrganisationQuery()
                        where organisation.Id == id
                        select organisation;
            return await query.FirstOrDefaultAsync();
        }

        public async Task<Result> InsertOrganisation(Organisation organisation)
        {
            var validator = new OrganisationValidator(true);
            var result = validator.Validate(organisation).GetResult();

            if (!result.Success)
                return result;

            var entity = MapModelToEntity(organisation);
            await _context.Organisation.AddAsync(entity);
            await _context.SaveChangesAsync();

            organisation.Id = entity.Id;
            result.Tag = organisation;

            return result;
        }

        public async Task<Result> UpdateOrganisation(Organisation organisation)
        {
            var validator = new OrganisationValidator(false);
            var result = validator.Validate(organisation).GetResult();

            if (!result.Success)
                return result;

            var entity = MapModelToEntity(organisation);
            _context.Entry(entity).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return result;
        }

        private IQueryable<Organisation> GetOrganisationQuery()
        {
            var query = from organisation in _context.Organisation
                        select new Organisation()
                        {
                            Id = organisation.Id,
                            Name = organisation.Name
                        };

            return query;
        }

        private OrganisationEntity MapModelToEntity(Organisation model)
        {
            return new OrganisationEntity()
            {
                Id = model.Id,
                Name = model.Name
            };
        }
    }
}