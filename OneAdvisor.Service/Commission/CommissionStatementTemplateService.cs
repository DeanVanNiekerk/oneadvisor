using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using OneAdvisor.Data;
using OneAdvisor.Data.Entities.Commission;
using OneAdvisor.Model;
using OneAdvisor.Model.Common;
using OneAdvisor.Model.Account.Model.Authentication;
using OneAdvisor.Model.Commission.Interface;
using OneAdvisor.Model.Commission.Model.Commission;
using OneAdvisor.Service.Common.Query;
using OneAdvisor.Service.Commission.Validators;
using OneAdvisor.Model.Commission.Model.CommissionStatement;
using OneAdvisor.Model.Commission.Model.CommissionStatementTemplate;
using OneAdvisor.Model.Commission.Model.CommissionStatementTemplate.Configuration;
using System.Collections.Generic;
using OneAdvisor.Model.Directory.Interface;

namespace OneAdvisor.Service.Commission
{
    public class CommissionStatementTemplateService : ICommissionStatementTemplateService
    {
        private readonly DataContext _context;
        private readonly ICommissionLookupService _lookupService;

        public CommissionStatementTemplateService(DataContext context, ICommissionLookupService lookupService)
        {
            _context = context;
            _lookupService = lookupService;
        }

        public async Task<PagedItems<CommissionStatementTemplate>> GetTemplates()
        {
            var query = from template in _context.CommissionStatementTemplate
                        select new CommissionStatementTemplate()
                        {
                            Id = template.Id,
                            CompanyId = template.CompanyId,
                            Name = template.Name
                        };

            var pagedItems = new PagedItems<CommissionStatementTemplate>();

            pagedItems.TotalItems = await query.CountAsync();
            pagedItems.Items = await query.ToListAsync();

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
                HeaderIdentifier = new HeaderIdentifier()
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
            sheet.Name = "Sheet 1";
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

            return entity;
        }


    }
}