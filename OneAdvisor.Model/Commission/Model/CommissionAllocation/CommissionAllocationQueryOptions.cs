using System;
using System.Collections.Generic;
using OneAdvisor.Model.Common;
using OneAdvisor.Model.Account.Model.Authentication;

namespace OneAdvisor.Model.Commission.Model.CommissionAllocation
{
    public class CommissionAllocationQueryOptions : QueryOptionsBase
    {
        public CommissionAllocationQueryOptions(ScopeOptions scope, string sortColumn, string sortDirection, int pageSize, int pageNumber, string filters = null)
        : base(sortColumn, sortDirection, pageSize, pageNumber, filters)
        {
            Scope = scope;

            FromClientId = new List<Guid>();
            ToClientId = new List<Guid>();

            var result = GetFilterValues<Guid>("FromClientId");
            if (result.Success)
                FromClientId = result.Value;

            result = GetFilterValues<Guid>("ToClientId");
            if (result.Success)
                ToClientId = result.Value;
        }

        public ScopeOptions Scope { get; set; }

        public List<Guid> FromClientId { get; set; }
        public List<Guid> ToClientId { get; set; }
    }
}