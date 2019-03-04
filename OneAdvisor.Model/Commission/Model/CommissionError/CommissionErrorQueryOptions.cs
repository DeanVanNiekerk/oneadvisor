using System;
using System.Collections.Generic;
using OneAdvisor.Model.Common;
using OneAdvisor.Model.Account.Model.Authentication;

namespace OneAdvisor.Model.Commission.Model.CommissionError
{
    public class CommissionErrorQueryOptions : QueryOptionsBase
    {
        public CommissionErrorQueryOptions(ScopeOptions scope, string sortColumn, string sortDirection, int pageSize, int pageNumber, string filters = null)
        : base(sortColumn, sortDirection, pageSize, pageNumber, filters)
        {
            Scope = scope;

            var resultBool = GetFilterValue<bool>("HasValidFormat");
            if (resultBool.Success)
                HasValidFormat = resultBool.Value;

            var resultGuid = GetFilterValue<Guid>("CommissionStatementId");
            if (resultGuid.Success)
                CommissionStatementId = resultGuid.Value;
        }

        public ScopeOptions Scope { get; set; }

        public Guid? CommissionStatementId { get; set; }
        public bool? HasValidFormat { get; set; }
    }
}