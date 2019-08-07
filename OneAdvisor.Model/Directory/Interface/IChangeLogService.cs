using System;
using System.Threading.Tasks;
using OneAdvisor.Model.Common;
using OneAdvisor.Model.Directory.Model.ChangeLog;

namespace OneAdvisor.Model.Directory.Interface
{
    public interface IChangeLogService
    {
        Task<PagedItems<ChangeLog>> GetChangeLogs(ChangeLogQueryOptions queryOptions);
        Task<ChangeLog> GetLatestChangeLog();
        Task<Result> UpdateChangeLog(ChangeLog changeLog);
        Task<Result> InsertChangeLog(ChangeLog changeLog);
    }
}
