using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using OneAdvisor.Data;
using OneAdvisor.Model.Common;
using OneAdvisor.Model.Directory.Model.Audit;
using OneAdvisor.Service.Common.Query;
using OneAdvisor.Model;
using OneAdvisor.Model.Directory.Interface;
using OneAdvisor.Data.Entities.Directory;
using OneAdvisor.Service.Directory.Validators;
using OneAdvisor.Model.Account.Model.Authentication;
using System;

namespace OneAdvisor.Service.Directory
{
    public class AuditService : IAuditService
    {
        private readonly DataContext _context;

        public AuditService(DataContext context)
        {
            _context = context;
        }

        public async Task<PagedItems<AuditLog>> GetAuditLogs(AuditLogQueryOptions queryOptions)
        {
            var query = from user in ScopeQuery.GetUserEntityQuery(_context, queryOptions.Scope)
                        join auditLog in _context.AuditLog
                            on user.Id equals auditLog.UserId
                        select new AuditLog()
                        {
                            Id = auditLog.Id,
                            Action = auditLog.Action,
                            Entity = auditLog.Entity,
                            Date = auditLog.Date,
                            Data = auditLog.Data,
                            UserId = auditLog.UserId,
                        };

            //Apply filters ----------------------------------------------------------------------------------------
            if (queryOptions.Action.Any())
                query = query.Where(b => queryOptions.Action.Contains(b.Action));

            if (queryOptions.UserId.Any())
                query = query.Where(b => queryOptions.UserId.Contains(b.UserId.Value));

            if (!string.IsNullOrEmpty(queryOptions.Entity))
                query = query.Where(m => EF.Functions.Like(m.Entity, $"{queryOptions.Entity}"));
            //------------------------------------------------------------------------------------------------------

            var pagedItems = new PagedItems<AuditLog>();

            //Get total items
            pagedItems.TotalItems = await query.CountAsync();

            //Ordering
            query = query.OrderBy(queryOptions.SortOptions.Column, queryOptions.SortOptions.Direction);

            //Paging
            pagedItems.Items = await query.TakePage(queryOptions.PageOptions.Number, queryOptions.PageOptions.Size).ToListAsync();

            return pagedItems;
        }

        public async Task<Result> InsertAuditLog(ScopeOptions scope, string action, string entity, dynamic data)
        {
            var log = new AuditLog()
            {
                UserId = scope.UserId,
                Action = action,
                Entity = entity,
                Data = data,
            };
            return await InsertAuditLog(log);
        }

        public async Task<Result> InsertAuditLog(AuditLog model)
        {
            var validator = new AuditLogValidator();
            var result = validator.Validate(model).GetResult();

            if (!result.Success)
                return result;

            var entity = MapCompanyModelToEntity(model);
            await _context.AuditLog.AddAsync(entity);
            await _context.SaveChangesAsync();

            model.Id = entity.Id;
            result.Tag = model;

            return result;
        }

        public Task<Result> InsertAuditLog(Guid? organistionId, Guid? userId, string action, string entity, dynamic data)
        {
            throw new NotImplementedException();
        }

        private AuditLogEntity MapCompanyModelToEntity(AuditLog model, AuditLogEntity entity = null)
        {
            if (entity == null)
                entity = new AuditLogEntity();

            entity.UserId = model.UserId;
            entity.Date = model.Date;
            entity.Action = model.Action;
            entity.Entity = model.Entity;
            entity.Data = model.Data;

            return entity;
        }
    }
}