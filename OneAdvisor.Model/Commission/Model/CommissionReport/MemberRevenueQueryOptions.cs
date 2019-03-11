using System;
using System.Collections.Generic;
using OneAdvisor.Model.Common;
using OneAdvisor.Model.Account.Model.Authentication;

namespace OneAdvisor.Model.Commission.Model.CommissionReport
{
    public class MemberRevenueQueryOptions : QueryOptionsBase
    {
        public MemberRevenueQueryOptions(ScopeOptions scope, string sortColumn, string sortDirection, int pageSize, int pageNumber, string filters = null)
        : base(sortColumn, sortDirection, pageSize, pageNumber, filters)
        {
            Scope = scope;

            var result = GetFilterValue<DateTime>("Start");
            if (result.Success)
                Start = result.Value;

            result = GetFilterValue<DateTime>("End");
            if (result.Success)
                End = result.Value;
        }

        public ScopeOptions Scope { get; set; }

        public DateTime? Start { get; set; }
        public DateTime? End { get; set; }

    }
}