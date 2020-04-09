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

namespace OneAdvisor.Service.Directory
{
    public class DirectoryLookupService : IDirectoryLookupService
    {
        private readonly DataContext _context;

        public DirectoryLookupService(DataContext context)
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

        #region Advice Scope

        public async Task<List<AdviceScope>> GetAdviceScopes()
        {
            var query = from scope in _context.AdviceScope
                        orderby scope.Name
                        select new AdviceScope()
                        {
                            Id = scope.Id,
                            Name = scope.Name,
                        };

            return await query.ToListAsync();
        }

        public async Task<Result> InsertAdviceScope(AdviceScope model)
        {
            var validator = new AdviceScopeValidator(true);
            var result = validator.Validate(model).GetResult();

            if (!result.Success)
                return result;

            var entity = MapAdviceScopeModelToEntity(model);
            await _context.AdviceScope.AddAsync(entity);
            await _context.SaveChangesAsync();

            model.Id = entity.Id;
            result.Tag = model;

            return result;
        }

        public async Task<Result> UpdateAdviceScope(AdviceScope model)
        {
            var validator = new AdviceScopeValidator(false);
            var result = validator.Validate(model).GetResult();

            if (!result.Success)
                return result;

            var entity = await _context.AdviceScope.FindAsync(model.Id);

            if (entity == null)
                return new Result();

            entity = MapAdviceScopeModelToEntity(model, entity);
            await _context.SaveChangesAsync();

            return result;
        }

        private AdviceScopeEntity MapAdviceScopeModelToEntity(AdviceScope model, AdviceScopeEntity entity = null)
        {
            if (entity == null)
                entity = new AdviceScopeEntity();

            entity.Name = model.Name;

            return entity;
        }

        #endregion

        #region Advice Service

        public async Task<List<AdviceService>> GetAdviceServices()
        {
            var query = from service in _context.AdviceService
                        orderby service.DisplayOrder
                        select new AdviceService()
                        {
                            Id = service.Id,
                            Name = service.Name,
                            DisplayOrder = service.DisplayOrder
                        };

            return await query.ToListAsync();
        }

        public async Task<Result> InsertAdviceService(AdviceService model)
        {
            var validator = new AdviceServiceValidator(true);
            var result = validator.Validate(model).GetResult();

            if (!result.Success)
                return result;

            var entity = MapAdviceServiceModelToEntity(model);
            await _context.AdviceService.AddAsync(entity);
            await _context.SaveChangesAsync();

            model.Id = entity.Id;
            result.Tag = model;

            return result;
        }

        public async Task<Result> UpdateAdviceService(AdviceService model)
        {
            var validator = new AdviceServiceValidator(false);
            var result = validator.Validate(model).GetResult();

            if (!result.Success)
                return result;

            var entity = await _context.AdviceService.FindAsync(model.Id);

            if (entity == null)
                return new Result();

            entity = MapAdviceServiceModelToEntity(model, entity);
            await _context.SaveChangesAsync();

            return result;
        }

        private AdviceServiceEntity MapAdviceServiceModelToEntity(AdviceService model, AdviceServiceEntity entity = null)
        {
            if (entity == null)
                entity = new AdviceServiceEntity();

            entity.Name = model.Name;
            entity.DisplayOrder = model.DisplayOrder;

            return entity;
        }

        #endregion

        #region License Category

        public async Task<List<LicenseCategory>> GetLicenseCategories()
        {
            var query = from category in _context.LicenseCategory
                        select new LicenseCategory()
                        {
                            Id = category.Id,
                            Code = category.Code,
                            Name = category.Name,
                        };

            var list = await query.ToListAsync();

            return list.OrderBy(item =>
            {
                Version version = new Version();
                Version.TryParse(item.Code, out version);
                return version;
            }).ToList();
        }

        public async Task<Result> InsertLicenseCategory(LicenseCategory model)
        {
            var validator = new LicenseCategoryValidator(true);
            var result = validator.Validate(model).GetResult();

            if (!result.Success)
                return result;

            var entity = MapLicenseCategoryModelToEntity(model);
            await _context.LicenseCategory.AddAsync(entity);
            await _context.SaveChangesAsync();

            model.Id = entity.Id;
            result.Tag = model;

            return result;
        }

        public async Task<Result> UpdateLicenseCategory(LicenseCategory model)
        {
            var validator = new LicenseCategoryValidator(false);
            var result = validator.Validate(model).GetResult();

            if (!result.Success)
                return result;

            var entity = await _context.LicenseCategory.FindAsync(model.Id);

            if (entity == null)
                return new Result();

            entity = MapLicenseCategoryModelToEntity(model, entity);
            await _context.SaveChangesAsync();

            return result;
        }

        private LicenseCategoryEntity MapLicenseCategoryModelToEntity(LicenseCategory model, LicenseCategoryEntity entity = null)
        {
            if (entity == null)
                entity = new LicenseCategoryEntity();

            entity.Code = model.Code;
            entity.Name = model.Name;

            return entity;
        }

        #endregion


        #region User Type

        public async Task<List<UserType>> GetUserTypes()
        {
            var query = GetUserTypeQuery();

            return await query.ToListAsync();
        }

        private IQueryable<UserType> GetUserTypeQuery()
        {
            var query = from userType in _context.UserType
                        orderby userType.DisplayOrder ascending
                        select new UserType()
                        {
                            Id = userType.Id,
                            Name = userType.Name,
                            DisplayOrder = userType.DisplayOrder
                        };

            return query;
        }

        #endregion

        #region VAT Rate

        public async Task<decimal> GetVATRate(DateTime date)
        {
            var query = from vatRate in _context.VATRate
                        where (vatRate.StartDate <= date || vatRate.StartDate == null)
                        && (vatRate.EndDate >= date || vatRate.EndDate == null)
                        select vatRate.Rate;

            return await query.SingleOrDefaultAsync();
        }

        #endregion

    }
}