using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using OneAdvisor.Data;
using OneAdvisor.Model.Common;
using OneAdvisor.Model.Directory.Model.Audit;
using OneAdvisor.Service.Common.Query;
using OneAdvisor.Model;
using OneAdvisor.Model.Directory.Interface;

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
            var query = from user in ScopeQuery.GetOktaUserEntityQuery(_context, queryOptions.Scope)
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
                query = query.Where(b => queryOptions.UserId.Contains(b.UserId));

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
    }
}