using System;
using System.Collections.Generic;
using OneAdvisor.Model.Common;
using OneAdvisor.Model.Account.Model.Authentication;

namespace OneAdvisor.Model.Commission.Model.CommissionReport
{
    public class UserCompanyMonthlyCommissionQueryOptions : QueryOptionsBase<UserCompanyMonthlyCommissionData>
    {
        public UserCompanyMonthlyCommissionQueryOptions(ScopeOptions scope, string sortColumn, string sortDirection, int pageSize, int pageNumber, string filters = null)
        : base(sortColumn, sortDirection, pageSize, pageNumber, filters)
        {
            Scope = scope;

            UserId = new List<Guid>();
            CompanyId = new List<Guid>();

            var result = GetFilterValue<DateTime>("StartDate");
            if (result.Success)
                StartDate = result.Value;

            result = GetFilterValue<DateTime>("EndDate");
            if (result.Success)
                EndDate = result.Value;

            var resultsGuid = GetFilterValues<Guid>("UserId");
            if (resultsGuid.Success)
                UserId = resultsGuid.Value;

            resultsGuid = GetFilterValues<Guid>("CompanyId");
            if (resultsGuid.Success)
                CompanyId = resultsGuid.Value;
        }

        public ScopeOptions Scope { get; set; }

        public List<int> Month { get; set; }
        public List<int> Year { get; set; }
        public List<Guid> UserId { get; set; }
        public List<Guid> CompanyId { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
    }
}