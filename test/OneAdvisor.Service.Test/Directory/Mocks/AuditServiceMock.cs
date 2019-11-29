using System;
using System.Threading.Tasks;
using OneAdvisor.Model.Account.Model.Authentication;
using OneAdvisor.Model.Common;
using OneAdvisor.Model.Directory.Interface;
using OneAdvisor.Model.Directory.Model.Audit;

namespace OneAdvisor.Service.Test.Directory.Mocks
{
    public class AuditServiceMock : IAuditService
    {
        public Task<AuditLogItems> GetAuditLogs(AuditLogQueryOptions queryOptions)
        {
            var items = new AuditLogItems();

            return Task.FromResult<AuditLogItems>(items);
        }

        public Task<Result> InsertAuditLogStringId(ScopeOptions scope, string action, string entity, string entityId, dynamic data)
        {
            var result = new Result(true);
            return Task.FromResult<Result>(result);
        }

        public Task<Result> InsertAuditLog(ScopeOptions scope, string action, string entity, Guid? entityId, dynamic data)
        {
            var result = new Result(true);
            return Task.FromResult<Result>(result);
        }

        public Task<Result> InsertAuditLog(Guid? organistionId, Guid? branchId, Guid? userId, string action, string entity, string entityId, dynamic data)
        {
            var result = new Result(true);
            return Task.FromResult<Result>(result);
        }
    }
}