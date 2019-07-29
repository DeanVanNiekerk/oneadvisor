using System;
using System.Collections.Generic;
using OneAdvisor.Model.Common;
using OneAdvisor.Model.Account.Model.Authentication;

namespace OneAdvisor.Model.Commission.Model.CommissionError
{
    public class CommissionErrorQueryOptions : QueryOptionsBase<CommissionError>
    {
        public CommissionErrorQueryOptions(ScopeOptions scope, string sortColumn, string sortDirection, int pageSize, int pageNumber, string filters = null)
        : base(sortColumn, sortDirection, pageSize, pageNumber, filters)
        {
            Scope = scope;

            var resultGuid = GetFilterValue<Guid>("CommissionStatementId");
            if (resultGuid.Success)
                CommissionStatementId = resultGuid.Value;

            var resultInt = GetFilterValue<int>("CommissionStatementYear");
            if (resultInt.Success)
                CommissionStatementYear = resultInt.Value;

            resultInt = GetFilterValue<int>("CommissionStatementMonth");
            if (resultInt.Success)
                CommissionStatementMonth = resultInt.Value;
        }

        public ScopeOptions Scope { get; set; }

        public Guid? CommissionStatementId { get; set; }

        public int? CommissionStatementYear { get; set; }
        public int? CommissionStatementMonth { get; set; }
    }
}