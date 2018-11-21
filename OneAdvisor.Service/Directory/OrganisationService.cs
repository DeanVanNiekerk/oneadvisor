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

namespace OneAdvisor.Service.Directory
{
    public class OrganisationService: IOrganisationService
    {
        private readonly DataContext _context;

        public OrganisationService(DataContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Organisation>> GetOrganisations()
        {
            return await GetOrganisationQuery().ToListAsync();
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

            if(!result.Success)
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

            if(!result.Success)
                return result;

            var entity = MapModelToEntity(organisation);
            _context.Entry(entity).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return result;
        }

        private IQueryable<Organisation> GetOrganisationQuery()
        {
            var query = from organisation in _context.Organisation
                        select new Organisation() {
                            Id = organisation.Id,
                            Name = organisation.Name
                        };

            return query;
        }

        private OrganisationEntity MapModelToEntity(Organisation model) 
        {
            return new OrganisationEntity() {
                Id = model.Id,
                Name = model.Name
            };
        }
    }
}