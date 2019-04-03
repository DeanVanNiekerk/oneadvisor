using System;
using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;
using OneAdvisor.Data;
using OneAdvisor.Model.Common;
using Microsoft.EntityFrameworkCore;
using OneAdvisor.Model;
using OneAdvisor.Service.Directory.Validators.Lookup;
using OneAdvisor.Model.Directory.Interface;
using OneAdvisor.Model.Directory.Model.Lookup;
using OneAdvisor.Data.Entities.Directory.Lookup;
using System.Text.RegularExpressions;
using OneAdvisor.Data.Entities.Commission.Lookup;

namespace OneAdvisor.Service.Directory
{
    public class LookupService : ILookupService
    {
        private readonly DataContext _context;

        public LookupService(DataContext context)
        {
            _context = context;
        }

        #region Company

        public async Task<List<Company>> GetCompanies()
        {
            var query = GetCompanyQuery();

            return await query.ToListAsync();
        }

        public async Task<Company> GetCompany(Guid id)
        {
            var query = from company in GetCompanyQuery()
                        where company.Id == id
                        select company;

            return await query.FirstOrDefaultAsync();
        }

        private IQueryable<Company> GetCompanyQuery()
        {
            var query = from company in _context.Company
                        orderby company.Name
                        select new Company()
                        {
                            Id = company.Id,
                            Name = company.Name,
                            CommissionPolicyNumberPrefixes = company.CommissionPolicyNumberPrefixes
                        };

            return query;
        }

        public async Task<Result> InsertCompany(Company model)
        {
            var validator = new CompanyValidator(true);
            var result = validator.Validate(model).GetResult();

            if (!result.Success)
                return result;

            var entity = MapCompanyModelToEntity(model);
            await _context.Company.AddAsync(entity);
            await _context.SaveChangesAsync();

            model.Id = entity.Id;
            result.Tag = model;

            return result;
        }

        public async Task<Result> UpdateCompany(Company model)
        {
            var validator = new CompanyValidator(false);
            var result = validator.Validate(model).GetResult();

            if (!result.Success)
                return result;

            var entity = await _context.Company.FindAsync(model.Id);

            if (entity == null)
                return new Result();

            entity = MapCompanyModelToEntity(model, entity);
            await _context.SaveChangesAsync();

            return result;
        }

        private CompanyEntity MapCompanyModelToEntity(Company model, CompanyEntity entity = null)
        {
            if (entity == null)
                entity = new CompanyEntity();

            entity.Name = model.Name;
            entity.CommissionPolicyNumberPrefixes = model.CommissionPolicyNumberPrefixes;

            return entity;
        }

        #endregion

    }
}