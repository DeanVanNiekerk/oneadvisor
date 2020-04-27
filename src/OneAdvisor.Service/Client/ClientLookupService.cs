using System;
using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;
using OneAdvisor.Data;
using OneAdvisor.Model.Common;
using Microsoft.EntityFrameworkCore;
using OneAdvisor.Model;
using OneAdvisor.Model.Client.Interface;
using OneAdvisor.Model.Client.Model.Lookup;
using OneAdvisor.Data.Entities.Client.Lookup;
using System.Text.RegularExpressions;
using OneAdvisor.Service.Client.Validators.Lookup;

namespace OneAdvisor.Service.Directory
{
    public class ClientLookupService : IClientLookupService
    {
        private readonly DataContext _context;

        public ClientLookupService(DataContext context)
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
                        orderby policyType.DisplayOrder
                        select new PolicyType()
                        {
                            Id = policyType.Id,
                            Name = policyType.Name,
                            Code = policyType.Code
                        };

            return await query.ToListAsync();
        }

        #endregion

        #region Client Type

        public async Task<List<ClientType>> GetClientTypes()
        {
            var query = from clientType in _context.ClientType
                        orderby clientType.DisplayOrder ascending
                        select new ClientType()
                        {
                            Id = clientType.Id,
                            Name = clientType.Name,
                            Code = clientType.Code
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

        #region Policy Product Type

        public async Task<List<PolicyProductType>> GetPolicyProductTypes()
        {
            var query = GetPolicyProductTypeQuery();

            return await query.ToListAsync();
        }

        private IQueryable<PolicyProductType> GetPolicyProductTypeQuery()
        {
            var query = from type in _context.PolicyProductType
                        orderby type.Name
                        select new PolicyProductType()
                        {
                            Id = type.Id,
                            PolicyTypeId = type.PolicyTypeId,
                            Name = type.Name,
                            Code = type.Code,
                            PolicyTypeCharacteristics = type.PolicyTypeCharacteristics
                        };

            return query;
        }

        public async Task<Result> InsertPolicyProductType(PolicyProductType model)
        {
            var validator = new PolicyProductTypeValidator(_context, true);
            var result = validator.Validate(model).GetResult();

            if (!result.Success)
                return result;

            var entity = MapPolicyProductTypeModelToEntity(model);
            await _context.PolicyProductType.AddAsync(entity);
            await _context.SaveChangesAsync();

            model.Id = entity.Id;
            result.Tag = model;

            return result;
        }

        public async Task<Result> UpdatePolicyProductType(PolicyProductType model)
        {
            var validator = new PolicyProductTypeValidator(_context, false);
            var result = validator.Validate(model).GetResult();

            if (!result.Success)
                return result;

            var entity = await _context.PolicyProductType.FindAsync(model.Id);

            if (entity == null)
                return new Result();

            entity = MapPolicyProductTypeModelToEntity(model, entity);
            await _context.SaveChangesAsync();

            return result;
        }

        private PolicyProductTypeEntity MapPolicyProductTypeModelToEntity(PolicyProductType model, PolicyProductTypeEntity entity = null)
        {
            if (entity == null)
                entity = new PolicyProductTypeEntity();

            entity.Name = model.Name;
            entity.Code = model.Code;
            entity.PolicyTypeId = model.PolicyTypeId.Value;
            entity.PolicyTypeCharacteristics = model.PolicyTypeCharacteristics;

            return entity;
        }

        #endregion

        #region Policy Type Characteristics

        public async Task<List<PolicyTypeCharacteristic>> GetPolicyTypeCharacteristics()
        {
            var query = GetPolicyTypeCharacteristicQuery();

            return await query.ToListAsync();
        }

        private IQueryable<PolicyTypeCharacteristic> GetPolicyTypeCharacteristicQuery()
        {
            var query = from type in _context.PolicyTypeCharacteristic
                        orderby type.PolicyTypeId, type.DisplayOrder
                        select new PolicyTypeCharacteristic()
                        {
                            Id = type.Id,
                            PolicyTypeId = type.PolicyTypeId,
                            Name = type.Name,
                            DisplayOrder = type.DisplayOrder
                        };

            return query;
        }

        public async Task<Result> InsertPolicyTypeCharacteristic(PolicyTypeCharacteristic model)
        {
            var validator = new PolicyTypeCharacteristicValidator(_context, true);
            var result = validator.Validate(model).GetResult();

            if (!result.Success)
                return result;

            var entity = MapPolicyTypeCharacteristicModelToEntity(model);
            await _context.PolicyTypeCharacteristic.AddAsync(entity);
            await _context.SaveChangesAsync();

            model.Id = entity.Id;
            result.Tag = model;

            return result;
        }

        public async Task<Result> UpdatePolicyTypeCharacteristic(PolicyTypeCharacteristic model)
        {
            var validator = new PolicyTypeCharacteristicValidator(_context, false);
            var result = validator.Validate(model).GetResult();

            if (!result.Success)
                return result;

            var entity = await _context.PolicyTypeCharacteristic.FindAsync(model.Id);

            if (entity == null)
                return new Result();

            entity = MapPolicyTypeCharacteristicModelToEntity(model, entity);
            await _context.SaveChangesAsync();

            return result;
        }

        private PolicyTypeCharacteristicEntity MapPolicyTypeCharacteristicModelToEntity(PolicyTypeCharacteristic model, PolicyTypeCharacteristicEntity entity = null)
        {
            if (entity == null)
                entity = new PolicyTypeCharacteristicEntity();

            entity.Name = model.Name;
            entity.DisplayOrder = model.DisplayOrder.Value;
            entity.PolicyTypeId = model.PolicyTypeId.Value;

            return entity;
        }

        #endregion

        #region Policy Product

        public async Task<List<PolicyProduct>> GetPolicyProducts()
        {
            var query = GetPolicyProductQuery();

            return await query.ToListAsync();
        }

        private IQueryable<PolicyProduct> GetPolicyProductQuery()
        {
            var query = from type in _context.PolicyProduct
                        orderby type.Name
                        select new PolicyProduct()
                        {
                            Id = type.Id,
                            PolicyProductTypeId = type.PolicyProductTypeId,
                            CompanyId = type.CompanyId,
                            Name = type.Name,
                            Code = type.Code
                        };

            return query;
        }

        public async Task<Result> InsertPolicyProduct(PolicyProduct model)
        {
            var validator = new PolicyProductValidator(_context, true);
            var result = validator.Validate(model).GetResult();

            if (!result.Success)
                return result;

            var entity = MapPolicyProductModelToEntity(model);
            await _context.PolicyProduct.AddAsync(entity);
            await _context.SaveChangesAsync();

            model.Id = entity.Id;
            result.Tag = model;

            return result;
        }

        public async Task<Result> UpdatePolicyProduct(PolicyProduct model)
        {
            var validator = new PolicyProductValidator(_context, false);
            var result = validator.Validate(model).GetResult();

            if (!result.Success)
                return result;

            var entity = await _context.PolicyProduct.FindAsync(model.Id);

            if (entity == null)
                return new Result();

            entity = MapPolicyProductModelToEntity(model, entity);
            await _context.SaveChangesAsync();

            return result;
        }

        private PolicyProductEntity MapPolicyProductModelToEntity(PolicyProduct model, PolicyProductEntity entity = null)
        {
            if (entity == null)
                entity = new PolicyProductEntity();

            entity.Name = model.Name;
            entity.Code = model.Code;
            entity.CompanyId = model.CompanyId.Value;
            entity.PolicyProductTypeId = model.PolicyProductTypeId.Value;

            return entity;
        }

        #endregion
    }
}