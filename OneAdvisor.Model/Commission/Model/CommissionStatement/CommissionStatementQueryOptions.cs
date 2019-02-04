using System;
using System.Collections.Generic;
using OneAdvisor.Model.Common;
using OneAdvisor.Model.Directory.Model.Auth;

namespace OneAdvisor.Model.Commission.Model.CommissionStatement
{
    public class CommissionStatementQueryOptions : QueryOptionsBase
    {
        public CommissionStatementQueryOptions(ScopeOptions scope, string sortColumn, string sortDirection, int pageSize, int pageNumber, string filters = null)
        : base(sortColumn, sortDirection, pageSize, pageNumber, filters)
        {
            Scope = scope;
        }

        public ScopeOptions Scope { get; set; }

    }
}