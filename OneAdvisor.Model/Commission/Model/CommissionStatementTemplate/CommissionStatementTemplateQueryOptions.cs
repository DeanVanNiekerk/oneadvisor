using System;
using System.Collections.Generic;
using OneAdvisor.Model.Common;
using OneAdvisor.Model.Account.Model.Authentication;

namespace OneAdvisor.Model.Commission.Model.CommissionStatementTemplate
{
    public class CommissionStatementTemplateQueryOptions : QueryOptionsBase<CommissionStatementTemplate>
    {
        public CommissionStatementTemplateQueryOptions(string sortColumn, string sortDirection, int pageSize, int pageNumber, string filters = null)
        : base(!string.IsNullOrWhiteSpace(sortColumn) ? sortColumn : "Name", !string.IsNullOrWhiteSpace(sortDirection) ? sortDirection : "asc", pageSize, pageNumber, filters)
        {
            CompanyId = new List<Guid>();

            var resultGuids = GetFilterValues<Guid>("CompanyId");
            if (resultGuids.Success)
                CompanyId = resultGuids.Value;

            var resultDate = GetFilterValue<DateTime>("Date");
            if (resultDate.Success)
                Date = resultDate.Value;
        }

        public List<Guid> CompanyId { get; set; }
        public DateTime? Date { get; set; }
    }
}