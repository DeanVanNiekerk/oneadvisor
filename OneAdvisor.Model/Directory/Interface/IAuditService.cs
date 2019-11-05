using System;
using System.Threading.Tasks;
using OneAdvisor.Model.Account.Model.Authentication;
using OneAdvisor.Model.Common;
using OneAdvisor.Model.Directory.Model.Audit;

namespace OneAdvisor.Model.Directory.Interface
{
    public interface IAuditService
    {
        Task<PagedItems<AuditLog>> GetAuditLogs(AuditLogQueryOptions queryOptions);
        Task<Result> InsertAuditLog(ScopeOptions scope, string action, string entity, dynamic data);
        Task<Result> InsertAuditLog(Guid? organistionId, Guid? userId, string action, string entity, dynamic data);
    }
}
