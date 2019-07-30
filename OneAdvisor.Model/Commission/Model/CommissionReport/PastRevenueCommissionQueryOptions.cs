using System;
using System.Collections.Generic;
using OneAdvisor.Model.Common;
using OneAdvisor.Model.Account.Model.Authentication;

namespace OneAdvisor.Model.Commission.Model.CommissionReport
{
    public class PastRevenueCommissionQueryOptions : QueryOptionsBase<PastRevenueCommissionData>
    {
        public PastRevenueCommissionQueryOptions(ScopeOptions scope, string sortColumn, string sortDirection, int pageSize, int pageNumber, string filters = null)
        : base(sortColumn, sortDirection, pageSize, pageNumber, filters)
        {
            Scope = scope;

            UserId = new List<Guid>();
            CompanyId = new List<Guid>();
            CommissionEarningsTypeId = new List<Guid>();
            PolicyTypeId = new List<Guid>();
            BranchId = new List<Guid>();

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

            resultsGuid = GetFilterValues<Guid>("CommissionEarningsTypeId");
            if (resultsGuid.Success)
                CommissionEarningsTypeId = resultsGuid.Value;

            resultsGuid = GetFilterValues<Guid>("PolicyTypeId");
            if (resultsGuid.Success)
                PolicyTypeId = resultsGuid.Value;

            resultsGuid = GetFilterValues<Guid>("BranchId");
            if (resultsGuid.Success)
                BranchId = resultsGuid.Value;
        }

        public ScopeOptions Scope { get; set; }

        public List<Guid> UserId { get; set; }
        public List<Guid> CompanyId { get; set; }
        public List<Guid> CommissionEarningsTypeId { get; set; }
        public List<Guid> PolicyTypeId { get; set; }
        public List<Guid> BranchId { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
    }
}