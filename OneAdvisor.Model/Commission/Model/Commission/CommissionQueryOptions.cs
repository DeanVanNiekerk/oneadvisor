using System;
using System.Collections.Generic;
using OneAdvisor.Model.Common;
using OneAdvisor.Model.Directory.Model.Auth;

namespace OneAdvisor.Model.Commission.Model.Commission
{
    public class CommissionQueryOptions : QueryOptionsBase
    {
        public CommissionQueryOptions(ScopeOptions scope, string sortColumn, string sortDirection, int pageSize, int pageNumber, string filters = null)
        : base(sortColumn, sortDirection, pageSize, pageNumber, filters)
        {
            Scope = scope;

            UserId = new List<string>();
            CommissionTypeId = new List<Guid>();

            var results = GetFilterValues<string>("UserId");
            if (results.Success)
                UserId = results.Value;

            var resultGuid = GetFilterValue<Guid>("CommissionStatementId");
            if (resultGuid.Success)
                CommissionStatementId = resultGuid.Value;

            var resultGuids = GetFilterValues<Guid>("CommissionTypeId");
            if (resultGuids.Success)
                CommissionTypeId = resultGuids.Value;
        }

        public ScopeOptions Scope { get; set; }

        public Guid? CommissionStatementId { get; set; }
        public List<string> UserId { get; set; }
        public List<Guid> CommissionTypeId { get; set; }
    }
}