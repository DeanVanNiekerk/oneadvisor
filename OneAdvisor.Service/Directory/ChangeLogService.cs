using System;
using System.Linq;
using System.Threading.Tasks;
using OneAdvisor.Data;
using OneAdvisor.Model.Common;
using Microsoft.EntityFrameworkCore;
using OneAdvisor.Model;
using OneAdvisor.Model.Directory.Interface;
using OneAdvisor.Model.Directory.Model.ChangeLog;
using OneAdvisor.Data.Entities.Directory;
using OneAdvisor.Service.Directory.Validators;

namespace OneAdvisor.Service.Directory
{
    public class ChangeLogService : IChangeLogService
    {
        private readonly DataContext _context;

        public ChangeLogService(DataContext context)
        {
            _context = context;
        }

        public async Task<PagedItems<ChangeLog>> GetChangeLogs(ChangeLogQueryOptions queryOptions)
        {
            var query = GetChangeLogQuery();

            var pagedItems = new PagedItems<ChangeLog>();

            //Get total items
            pagedItems.TotalItems = await query.CountAsync();

            //Ordering
            query = query.OrderBy(queryOptions.SortOptions.Column, queryOptions.SortOptions.Direction);

            //Paging
            pagedItems.Items = await query.TakePage(queryOptions.PageOptions.Number, queryOptions.PageOptions.Size).ToListAsync();

            return pagedItems;
        }

        public async Task<ChangeLog> GetLatestChangeLog()
        {
            var query = from changeLog in GetChangeLogQuery()
                        orderby changeLog.ReleaseDate descending
                        select changeLog;

            return await query.FirstOrDefaultAsync();
        }

        public async Task<Result> InsertChangeLog(ChangeLog model)
        {
            var validator = new ChangeLogValidator(true);
            var result = validator.Validate(model).GetResult();

            if (!result.Success)
                return result;

            var entity = MapCompanyModelToEntity(model);
            await _context.ChangeLog.AddAsync(entity);
            await _context.SaveChangesAsync();

            model.Id = entity.Id;
            result.Tag = model;

            return result;
        }

        public async Task<Result> UpdateChangeLog(ChangeLog model)
        {
            var validator = new ChangeLogValidator(false);
            var result = validator.Validate(model).GetResult();

            if (!result.Success)
                return result;

            var entity = await _context.ChangeLog.FindAsync(model.Id);

            if (entity == null)
                return new Result();

            entity = MapCompanyModelToEntity(model, entity);
            await _context.SaveChangesAsync();

            return result;
        }

        private ChangeLogEntity MapCompanyModelToEntity(ChangeLog model, ChangeLogEntity entity = null)
        {
            if (entity == null)
                entity = new ChangeLogEntity();

            entity.VersionNumber = model.VersionNumber;
            entity.ReleaseDate = model.ReleaseDate.Value;
            entity.Log = model.Log;

            return entity;
        }

        private IQueryable<ChangeLog> GetChangeLogQuery()
        {
            var query = from changeLog in _context.ChangeLog
                        select new ChangeLog()
                        {
                            Id = changeLog.Id,
                            VersionNumber = changeLog.VersionNumber,
                            ReleaseDate = changeLog.ReleaseDate,
                            Log = changeLog.Log
                        };

            return query;
        }

    }
}