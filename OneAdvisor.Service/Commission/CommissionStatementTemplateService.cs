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

namespace OneAdvisor.Service.Commission
{
    public class CommissionStatementTemplateService : ICommissionStatementTemplateService
    {
        private readonly DataContext _context;

        public CommissionStatementTemplateService(DataContext context)
        {
            _context = context;
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