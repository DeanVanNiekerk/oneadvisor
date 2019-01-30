using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using OneAdvisor.Model.Common;
using OneAdvisor.Model.Directory.Model.Audit;

namespace OneAdvisor.Model.Directory.Interface
{
    public interface IAuditService
    {
        Task<PagedItems<AuditLog>> GetAuditLogs(AuditLogQueryOptions queryOptions);
    }
}
