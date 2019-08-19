using System;
using System.Linq;
using System.Threading.Tasks;
using OneAdvisor.Data;
using OneAdvisor.Model.Common;
using OneAdvisor.Model.Directory.Interface;
using OneAdvisor.Model.Directory.Model.Organisation;
using Microsoft.EntityFrameworkCore;
using OneAdvisor.Data.Entities.Directory;
using OneAdvisor.Model;
using OneAdvisor.Service.Directory.Validators;
using OneAdvisor.Model.Account.Model.Authentication;
using OneAdvisor.Service.Common.Query;
using OneAdvisor.Model.Directory.Model.User;

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
            var query = from organisation in ScopeQuery.GetOrganisationEntityQuery(_context, queryOptions.Scope)
                        select new Organisation()
                        {
                            Id = organisation.Id,
                            Name = organisation.Name
                        };

            var pagedItems = new PagedItems<Organisation>();

            //Get total items
            pagedItems.TotalItems = await query.CountAsync();

            //Ordering
            query = query.OrderBy(queryOptions.SortOptions.Column, queryOptions.SortOptions.Direction);

            //Paging
            pagedItems.Items = await query.TakePage(queryOptions.PageOptions.Number, queryOptions.PageOptions.Size).ToListAsync();

            return pagedItems;
        }

        public async Task<OrganisationEdit> GetOrganisation(ScopeOptions scope, Guid id)
        {
            var query = from organisation in GetOrganisationEnitiyQuery(scope)
                        where organisation.Id == id
                        select new OrganisationEdit()
                        {
                            Id = organisation.Id,
                            Name = organisation.Name,
                            OrganisationCompanyIds = organisation.OrganisationToCompanies.Where(c => c.OrganisationId == organisation.Id).Select(c => c.CompanyId)
                        };

            return await query.FirstOrDefaultAsync();
        }

        public async Task<Result> InsertOrganisation(ScopeOptions scope, OrganisationEdit organisation)
        {
            var validator = new OrganisationValidator(true);
            var result = validator.Validate(organisation).GetResult();

            if (!result.Success)
                return result;

            //Only for super admins
            if (!scope.IgnoreScope)
                return new Result();

            var entity = MapModelToEntity(organisation);
            await _context.Organisation.AddAsync(entity);
            await _context.SaveChangesAsync();

            organisation.Id = entity.Id;

            await InsertOrganisationCompanies(organisation);

            result.Tag = organisation;

            return result;
        }

        private async Task InsertOrganisationCompanies(OrganisationEdit organisation)
        {
            var companies = organisation.OrganisationCompanyIds
               .Select(companyId => new OrganisationToCompanyEntity()
               {
                   OrganisationId = organisation.Id.Value,
                   CompanyId = companyId
               }
               );
            await _context.OrganisationToCompany.AddRangeAsync(companies);
            await _context.SaveChangesAsync();
        }

        private async Task DeleteOrganisationCompanies(Guid organisationId)
        {
            var companies = await _context.OrganisationToCompany.Where(o => o.OrganisationId == organisationId).ToListAsync();
            _context.OrganisationToCompany.RemoveRange(companies);
            await _context.SaveChangesAsync();
        }

        public async Task<Result> UpdateOrganisation(ScopeOptions scope, OrganisationEdit organisation)
        {
            var validator = new OrganisationValidator(false);
            var result = validator.Validate(organisation).GetResult();

            if (!result.Success)
                return result;

            //Only organisation scope
            if (scope.Scope == Scope.Branch || scope.Scope == Scope.User)
                return new Result();

            var entity = await ScopeQuery
                            .GetOrganisationEntityQuery(_context, scope)
                            .FirstOrDefaultAsync(o => o.Id == organisation.Id);

            if (entity == null)
                return new Result();

            entity = MapModelToEntity(organisation, entity);
            await _context.SaveChangesAsync();

            await DeleteOrganisationCompanies(organisation.Id.Value);
            await InsertOrganisationCompanies(organisation);

            return result;
        }

        private IQueryable<OrganisationEntity> GetOrganisationEnitiyQuery(ScopeOptions scope)
        {
            var query = from organisation in ScopeQuery.GetOrganisationEntityQuery(_context, scope)
                        select organisation;

            return query;
        }

        private OrganisationEntity MapModelToEntity(OrganisationEdit model, OrganisationEntity enity = null)
        {
            if (enity == null)
                enity = new OrganisationEntity();

            enity.Name = model.Name;

            return enity;
        }
    }
}