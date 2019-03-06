using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using OneAdvisor.Data;
using OneAdvisor.Data.Entities.Commission;

namespace OneAdvisor.Service.Common.BulkActions
{
    public interface IBulkActions
    {
        Task BulkInsertCommissionsAsync(DataContext context, IList<CommissionEntity> items);
        Task BulkInsertCommissionErrorsAsync(DataContext context, IList<CommissionErrorEntity> items);

        Task BatchDeleteCommissionsAsync(DataContext context, Guid commissionStatementId);
        Task BatchDeleteCommissionErrorsAsync(DataContext context, Guid commissionStatementId);
    }
}