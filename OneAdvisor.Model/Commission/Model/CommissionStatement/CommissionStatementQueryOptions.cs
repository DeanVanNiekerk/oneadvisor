using System;
using System.Collections.Generic;
using OneAdvisor.Model.Common;
using OneAdvisor.Model.Directory.Model.Auth;

namespace OneAdvisor.Model.Commission.Model.CommissionStatement
{
    public class CommissionStatementQueryOptions : QueryOptionsBase
    {
        public CommissionStatementQueryOptions(ScopeOptions scope, string sortColumn, string sortDirection, int pageSize, int pageNumber, string filters = null)
        : base(!string.IsNullOrWhiteSpace(sortColumn) ? sortColumn : "Date", !string.IsNullOrWhiteSpace(sortDirection) ? sortDirection : "desc", pageSize, pageNumber, filters)
        {
            Scope = scope;

            var result = GetFilterValue<bool>("Processed");
            if (result.Success)
                Processed = result.Value;

            var resultGuid = GetFilterValue<Guid>("CommissionStatementId");
            if (resultGuid.Success)
                CommissionStatementId = resultGuid.Value;

            var resultGuids = GetFilterValues<Guid>("CompanyId");
            if (resultGuids.Success)
                CompanyId = resultGuids.Value;

            var resultDate = GetFilterValue<DateTime>("StartDate");
            if (resultDate.Success)
                StartDate = resultDate.Value;

            resultDate = GetFilterValue<DateTime>("EndDate");
            if (resultDate.Success)
                EndDate = resultDate.Value;
        }

        public ScopeOptions Scope { get; set; }

        public bool? Processed { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public Guid? CommissionStatementId { get; set; }
        public List<Guid> CompanyId { get; set; }

    }
}