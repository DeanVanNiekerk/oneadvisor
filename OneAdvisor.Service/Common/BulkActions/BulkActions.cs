using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using EFCore.BulkExtensions;
using OneAdvisor.Data;
using OneAdvisor.Data.Entities.Commission;

namespace OneAdvisor.Service.Common.BulkActions
{
    public class BulkActions : IBulkActions
    {
        public async Task BatchDeleteCommissionErrorsAsync(DataContext context, Guid commissionStatementId)
        {
            await context.CommissionError.Where(c => c.CommissionStatementId == commissionStatementId).BatchDeleteAsync();
        }

        public async Task BatchDeleteCommissionsAsync(DataContext context, Guid commissionStatementId)
        {
            await context.Commission.Where(c => c.CommissionStatementId == commissionStatementId).BatchDeleteAsync();
        }

        public async Task BulkInsertCommissionErrorsAsync(DataContext context, IList<CommissionErrorEntity> items)
        {
            await context.BulkInsertAsync(items);
        }

        public async Task BulkInsertCommissionsAsync(DataContext context, IList<CommissionEntity> items)
        {
            await context.BulkInsertAsync(items);
        }

        public async Task BulkUpdateCommissionsAsync(DataContext context, IList<CommissionEntity> items)
        {
            await context.BulkUpdateAsync(items);
        }
    }
}