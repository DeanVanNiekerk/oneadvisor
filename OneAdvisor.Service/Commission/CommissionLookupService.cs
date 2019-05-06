using System;
using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;
using OneAdvisor.Data;
using OneAdvisor.Model.Common;
using Microsoft.EntityFrameworkCore;
using OneAdvisor.Model;
using OneAdvisor.Data.Entities.Directory.Lookup;
using System.Text.RegularExpressions;
using OneAdvisor.Data.Entities.Commission.Lookup;
using OneAdvisor.Model.Commission.Interface;
using OneAdvisor.Model.Commission.Model.Lookup;
using OneAdvisor.Service.Commission.Validators.Lookup;

namespace OneAdvisor.Service.Commission
{
    public class CommissionLookupService : ICommissionLookupService
    {
        private readonly DataContext _context;

        public CommissionLookupService(DataContext context)
        {
            _context = context;
        }

        #region Commission Type

        public async Task<List<CommissionType>> GetCommissionTypes()
        {
            var query = from commissionType in GetCommissionTypeQuery()
                        orderby commissionType.Name
                        select commissionType;

            return await query.ToListAsync();
        }

        public async Task<CommissionType> GetCommissionType(string code)
        {
            var query = from commissionType in GetCommissionTypeQuery()
                        where EF.Functions.Like(commissionType.Code, code)
                        select commissionType;

            return await query.FirstOrDefaultAsync();
        }

        public async Task<Result> InsertCommissionType(CommissionType model)
        {
            var validator = new CommissionTypeValidator(_context, true);
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
            var validator = new CommissionTypeValidator(_context, false);
            var result = validator.Validate(model).GetResult();

            if (!result.Success)
                return result;

            var entity = await _context.CommissionType.FindAsync(model.Id);

            if (entity == null)
                return new Result();

            entity = MapCommissionTypeModelToEntity(model, entity);
            await _context.SaveChangesAsync();

            return result;
        }

        private CommissionTypeEntity MapCommissionTypeModelToEntity(CommissionType model, CommissionTypeEntity entity = null)
        {
            if (entity == null)
                entity = new CommissionTypeEntity();

            entity.Name = model.Name;
            entity.Code = model.Code;
            entity.PolicyTypeId = model.PolicyTypeId.Value;
            entity.CommissionEarningsTypeId = model.CommissionEarningsTypeId.Value;

            return entity;
        }

        public IQueryable<CommissionType> GetCommissionTypeQuery()
        {
            var query = from commissionType in _context.CommissionType
                        select new CommissionType()
                        {
                            Id = commissionType.Id,
                            Name = commissionType.Name,
                            Code = commissionType.Code,
                            PolicyTypeId = commissionType.PolicyTypeId,
                            CommissionEarningsTypeId = commissionType.CommissionEarningsTypeId
                        };

            return query;
        }

        #endregion

        #region Commission Earnings Type

        public async Task<List<CommissionEarningsType>> GetCommissionEarningsTypes()
        {
            var query = from type in _context.CommissionEarningsType
                        orderby type.DisplayOrder
                        select new CommissionEarningsType()
                        {
                            Id = type.Id,
                            Name = type.Name
                        };

            return await query.ToListAsync();
        }

        #endregion

        #region Commission Statement Template Field Name

        public List<CommissionStatementTemplateFieldName> GetCommissionStatementTemplateFieldNames()
        {
            return Enum.GetNames(typeof(OneAdvisor.Model.Commission.Model.CommissionStatementTemplate.Configuration.FieldNames))
                .Select(f =>
                    new CommissionStatementTemplateFieldName()
                    {
                        Id = f,
                        Name = f.SplitCamelCase()
                    }
                ).ToList();
        }

        #endregion
    }
}