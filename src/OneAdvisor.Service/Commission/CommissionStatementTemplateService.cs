using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using OneAdvisor.Data;
using OneAdvisor.Data.Entities.Commission;
using OneAdvisor.Model;
using OneAdvisor.Model.Common;
using OneAdvisor.Model.Commission.Interface;
using OneAdvisor.Service.Commission.Validators;
using OneAdvisor.Model.Commission.Model.CommissionStatementTemplate;
using OneAdvisor.Model.Commission.Model.CommissionStatementTemplate.Configuration;
using System.Collections.Generic;
using OneAdvisor.Service.Common.BulkActions;

namespace OneAdvisor.Service.Commission
{
    public class CommissionStatementTemplateService : ICommissionStatementTemplateService
    {
        private readonly DataContext _context;
        private readonly ICommissionLookupService _lookupService;
        private readonly IBulkActions _bulkActions;

        public CommissionStatementTemplateService(DataContext context, ICommissionLookupService lookupService, IBulkActions bulkActions)
        {
            _context = context;
            _lookupService = lookupService;
            _bulkActions = bulkActions;
        }

        public async Task<PagedItems<CommissionStatementTemplate>> GetTemplates(CommissionStatementTemplateQueryOptions queryOptions)
        {
            var query = from template in _context.CommissionStatementTemplate
                        select new CommissionStatementTemplate()
                        {
                            Id = template.Id,
                            CompanyId = template.CompanyId,
                            Name = template.Name,
                            StartDate = template.StartDate,
                            EndDate = template.EndDate,
                            BrokerSpecific = template.BrokerSpecific,
                        };

            //Apply filters ----------------------------------------------------------------------------------------
            if (queryOptions.CompanyId.Any())
                query = query.Where(c => queryOptions.CompanyId.Contains(c.CompanyId));

            if (queryOptions.Date.HasValue)
            {
                query = query.Where(c => c.StartDate <= queryOptions.Date.Value.Date || c.StartDate == null);
                query = query.Where(c => c.EndDate >= queryOptions.Date.Value.Date || c.EndDate == null);
            }
            //------------------------------------------------------------------------------------------------------

            var pagedItems = new PagedItems<CommissionStatementTemplate>();

            //Get total items
            pagedItems.TotalItems = await query.CountAsync();

            //Ordering
            query = query.OrderBy(queryOptions.SortOptions.Column, queryOptions.SortOptions.Direction);

            //Paging
            pagedItems.Items = await query.TakePage(queryOptions.PageOptions.Number, queryOptions.PageOptions.Size).ToListAsync();

            return pagedItems;
        }

        public async Task<CommissionStatementTemplateEdit> GetTemplate(Guid templateId)
        {
            var query = from template in _context.CommissionStatementTemplate
                        where template.Id == templateId
                        select new CommissionStatementTemplateEdit()
                        {
                            Id = template.Id,
                            CompanyId = template.CompanyId,
                            Name = template.Name,
                            StartDate = template.StartDate,
                            EndDate = template.EndDate,
                            BrokerSpecific = template.BrokerSpecific,
                            Config = template.Config
                        };

            return await query.FirstOrDefaultAsync();
        }

        public async Task<Result> InsertTemplate(CommissionStatementTemplateEdit template)
        {
            var validator = new CommissionStatementTemplateValidator(true);
            var result = validator.Validate(template).GetResult();

            if (!result.Success)
                return result;

            var entity = MapModelToEntity(template);
            await _context.CommissionStatementTemplate.AddAsync(entity);
            await _context.SaveChangesAsync();

            template.Id = entity.Id;
            result.Tag = template;

            return result;
        }

        public async Task<Result> UpdateTemplate(CommissionStatementTemplateEdit template)
        {
            var validator = new CommissionStatementTemplateValidator(false);
            var result = validator.Validate(template).GetResult();

            if (!result.Success)
                return result;

            var entity = await _context.CommissionStatementTemplate.FirstOrDefaultAsync(b => b.Id == template.Id);

            if (entity == null)
                return new Result();

            entity = MapModelToEntity(template, entity);
            await _context.SaveChangesAsync();

            return result;
        }

        public async Task<Config> GetDefaultConfig()
        {
            var sheetConfig = new SheetConfig()
            {
                //No header
                HeaderIdentifier = new Identifier()
                {
                    Column = "",
                    Value = ""
                },
                Fields = new List<Field>() {
                    new Field() { Name = Enum.GetName(typeof(FieldNames), FieldNames.PolicyNumber), Column = "A" },
                    new Field() { Name = Enum.GetName(typeof(FieldNames), FieldNames.AmountIncludingVAT), Column = "B" },
                    new Field() { Name = Enum.GetName(typeof(FieldNames), FieldNames.VAT), Column = "C" },
                    new Field() { Name = Enum.GetName(typeof(FieldNames), FieldNames.LastName), Column = "E" },
                    new Field() { Name = Enum.GetName(typeof(FieldNames), FieldNames.DateOfBirth), Column = "F" },
                    new Field() { Name = Enum.GetName(typeof(FieldNames), FieldNames.FirstName), Column = "G" },
                    new Field() { Name = Enum.GetName(typeof(FieldNames), FieldNames.IdNumber), Column = "H" },
                    new Field() { Name = Enum.GetName(typeof(FieldNames), FieldNames.Initials), Column = "I" },
                    new Field() { Name = Enum.GetName(typeof(FieldNames), FieldNames.FullName), Column = "J" },
                    new Field() { Name = Enum.GetName(typeof(FieldNames), FieldNames.BrokerFullName), Column = "K" }
                },
                CommissionTypes = new CommissionTypes()
                {
                    MappingTemplate = "D",
                    DefaultCommissionTypeCode = "unknown",
                    Types = new List<CommissionType>()
                }
            };

            var commissionTypes = await _lookupService.GetCommissionTypes();
            sheetConfig.CommissionTypes.Types = commissionTypes
                .Select(c => new CommissionType()
                {
                    CommissionTypeCode = c.Code,
                    Value = c.Code
                }
                )
                .ToList();

            var sheet = new Sheet();
            sheet.Position = 1;
            sheet.Config = sheetConfig;

            var config = new Config();
            config.Sheets = new List<Sheet>() { sheet };

            return config;
        }

        private CommissionStatementTemplateEntity MapModelToEntity(CommissionStatementTemplateEdit model, CommissionStatementTemplateEntity entity = null)
        {
            if (entity == null)
                entity = new CommissionStatementTemplateEntity();

            entity.Name = model.Name;
            entity.CompanyId = model.CompanyId.Value;
            entity.Config = model.Config;
            entity.StartDate = model.StartDate.HasValue ? (DateTime?)model.StartDate.Value.Date : null;
            entity.EndDate = model.EndDate.HasValue ? (DateTime?)model.EndDate.Value.Date : null;
            entity.BrokerSpecific = model.BrokerSpecific;

            return entity;
        }


        public async Task UpdateUnknownCommissionTypes(Guid commissionStatementTemplateId)
        {
            var template = await _context.CommissionStatementTemplate.FindAsync(commissionStatementTemplateId);



            var commissionTypes = await _context.CommissionType.ToListAsync();
            var commissionTypeIndex = commissionTypes.ToDictionary(c => c.Code, c => c.Id);

            var commissionTypeMap = template.Config.Sheets.Select(s => s.Config.CommissionTypes.Types).SelectMany(t => t).ToList();



            //Get all commissions for this company that have unknown commission types ------------------------
            var commissionQuery = from statement in _context.CommissionStatement
                                  join commission in _context.Commission
                                      on statement.Id equals commission.CommissionStatementId
                                  where statement.CompanyId == template.CompanyId
                                  && commission.CommissionTypeId == OneAdvisor.Model.Commission.Model.Lookup.CommissionType.COMMISSION_TYPE_UNKNOWN_ID
                                  select commission;

            var updatedCommissions = new List<CommissionEntity>();
            foreach (var commission in commissionQuery)
            {
                //Check if there is a mapping for this commission type now
                var map = commissionTypeMap.FirstOrDefault(t => t.Value.IgnoreCaseEquals(commission.SourceData.CommissionTypeValue));
                if (map != null && commissionTypeIndex.ContainsKey(map.CommissionTypeCode))
                {
                    commission.CommissionTypeId = commissionTypeIndex[map.CommissionTypeCode];
                    commission.SourceData.CommissionTypeCode = map.CommissionTypeCode;
                    updatedCommissions.Add(commission);
                }
            }

            if (updatedCommissions.Any())
                await _bulkActions.BulkUpdateCommissionsAsync(_context, updatedCommissions);
            //----------------------------------------------------------------------------------------------------


            //Get all commission errors for this company that have unknown commission types ----------------------
            var errorQuery = from statement in _context.CommissionStatement
                             join error in _context.CommissionError
                                 on statement.Id equals error.CommissionStatementId
                             where statement.CompanyId == template.CompanyId
                             && error.CommissionTypeId == OneAdvisor.Model.Commission.Model.Lookup.CommissionType.COMMISSION_TYPE_UNKNOWN_ID
                             select error;

            var updatedErrors = new List<CommissionErrorEntity>();
            foreach (var error in errorQuery)
            {
                //Check if there is a mapping for this commission type now
                var map = commissionTypeMap.FirstOrDefault(t => t.Value.IgnoreCaseEquals(error.Data.CommissionTypeValue));
                if (map != null && commissionTypeIndex.ContainsKey(map.CommissionTypeCode))
                {
                    error.CommissionTypeId = commissionTypeIndex[map.CommissionTypeCode];
                    error.Data.CommissionTypeCode = map.CommissionTypeCode;
                    updatedErrors.Add(error);
                }
            }

            if (updatedErrors.Any())
                await _bulkActions.BulkUpdateCommissionErrorsAsync(_context, updatedErrors);
            //----------------------------------------------------------------------------------------------------
        }
    }
}