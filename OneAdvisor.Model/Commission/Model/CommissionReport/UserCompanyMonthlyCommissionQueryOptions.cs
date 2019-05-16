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

            Month = new List<int>();
            Year = new List<int>();
            UserId = new List<Guid>();
            CompanyId = new List<Guid>();

            //Defaults 
            var thisMonth = DateTime.UtcNow;
            Month.Add(thisMonth.Month);
            Year.Add(thisMonth.Year);

            var results = GetFilterValues<int>("Month");
            if (results.Success)
                Month = results.Value;

            results = GetFilterValues<int>("Year");
            if (results.Success)
                Year = results.Value;

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
    }
}