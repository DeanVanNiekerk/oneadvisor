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
    public class LookupService : ILookupService
    {
        private readonly DataContext _context;

        public LookupService(DataContext context)
        {
            _context = context;
        }

        #region Contact Type

        public async Task<List<ContactType>> GetContactTypes()
        {
            var query = from contactType in _context.ContactType
                        orderby contactType.Name
                        select new ContactType()
                        {
                            Id = contactType.Id,
                            Name = contactType.Name
                        };

            return await query.ToListAsync();
        }

        #endregion

        #region Policy Type

        public async Task<List<PolicyType>> GetPolicyTypes()
        {
            var query = from policyType in _context.PolicyType
                        orderby policyType.Name
                        select new PolicyType()
                        {
                            Id = policyType.Id,
                            Name = policyType.Name
                        };

            return await query.ToListAsync();
        }

        #endregion

        #region Marrial Status

        public async Task<List<MarritalStatus>> GetMarritalStatus()
        {
            var query = from marrialStatus in _context.MarritalStatus
                        orderby marrialStatus.Name
                        select new MarritalStatus()
                        {
                            Id = marrialStatus.Id,
                            Name = marrialStatus.Name
                        };

            return await query.ToListAsync();
        }

        #endregion

        #region Company

        public async Task<List<Company>> GetCompanies()
        {
            var query = from company in _context.Company
                        orderby company.Name
                        select new Company()
                        {
                            Id = company.Id,
                            Name = company.Name
                        };

            return await query.ToListAsync();
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

            var entity = MapCompanyModelToEntity(model);
            _context.Entry(entity).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return result;
        }

        private CompanyEntity MapCompanyModelToEntity(Company model)
        {
            return new CompanyEntity()
            {
                Id = model.Id,
                Name = model.Name
            };
        }

        #endregion

        #region Commission Type

        public async Task<List<CommissionType>> GetCommissionTypes()
        {
            var query = from commissionType in _context.CommissionType
                        orderby commissionType.Name
                        select new CommissionType()
                        {
                            Id = commissionType.Id,
                            Name = commissionType.Name,
                            Code = commissionType.Code,
                            PolicyTypeId = commissionType.PolicyTypeId
                        };

            return await query.ToListAsync();
        }

        public async Task<Result> InsertCommissionType(CommissionType model)
        {
            var validator = new CommissionTypeValidator(true);
            var result = validator.Validate(model).GetResult();

            if (!result.Success)
                return result;

            var entity = MapCommissionTypeModelToEntity(model);
            await _context.CommissionType.AddAsync(entity);
            await _context.SaveChangesAsync();

            model.Id = entity.Id;
            result.Tag = model;

            return result;
        }

        public async Task<Result> UpdateCommissionType(CommissionType model)
        {
            var validator = new CommissionTypeValidator(false);
            var result = validator.Validate(model).GetResult();

            if (!result.Success)
                return result;

            var entity = MapCommissionTypeModelToEntity(model);
            _context.Entry(entity).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return result;
        }

        private CommissionTypeEntity MapCommissionTypeModelToEntity(CommissionType model)
        {
            return new CommissionTypeEntity()
            {
                Id = model.Id,
                Name = model.Name,
                Code = model.Code,
                PolicyTypeId = model.PolicyTypeId
            };
        }

        #endregion
    }
}