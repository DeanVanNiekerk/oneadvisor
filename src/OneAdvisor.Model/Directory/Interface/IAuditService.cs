﻿using System;
using System.Threading.Tasks;
using OneAdvisor.Model.Account.Model.Authentication;
using OneAdvisor.Model.Common;
using OneAdvisor.Model.Directory.Model.Audit;

namespace OneAdvisor.Model.Directory.Interface
{
    public interface IAuditService
    {
        Task<AuditLogItems> GetAuditLogs(AuditLogQueryOptions queryOptions);
        Task<Result> InsertAuditLogStringId(ScopeOptions scope, string action, string entity, string entityId, dynamic data);
        Task<Result> InsertAuditLog(ScopeOptions scope, string action, string entity, Guid? entityId, dynamic data);
        Task<Result> InsertAuditLog(Guid? organistionId, Guid? branchId, Guid? userId, string action, string entity, string entityId, dynamic data);
    }
}
