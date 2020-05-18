using System;
using System.Collections.Generic;
using OneAdvisor.Model.Common;
using OneAdvisor.Model.Account.Model.Authentication;

namespace OneAdvisor.Model.Commission.Model.Commission
{
    public class CommissionQueryOptions : QueryOptionsBase<Commission>
    {
        public CommissionQueryOptions(ScopeOptions scope, string sortColumn, string sortDirection, int pageSize, int pageNumber, string filters = null)
        : base(sortColumn, sortDirection, pageSize, pageNumber, filters)
        {
            Scope = scope;

            UserId = new List<Guid>();
            BranchId = new List<Guid>();
            CommissionTypeId = new List<Guid>();
            PolicyCompanyId = new List<Guid>();

            var resultGuid = GetFilterValue<Guid>("CommissionStatementId");
            if (resultGuid.Success)
                CommissionStatementId = resultGuid.Value;

            var resultGuids = GetFilterValues<Guid>("CommissionTypeId");
            if (resultGuids.Success)
                CommissionTypeId = resultGuids.Value;

            resultGuids = GetFilterValues<Guid>("UserId");
            if (resultGuids.Success)
                UserId = resultGuids.Value;

            resultGuids = GetFilterValues<Guid>("BranchId");
            if (resultGuids.Success)
                BranchId = resultGuids.Value;

            resultGuids = GetFilterValues<Guid>("PolicyCompanyId");
            if (resultGuids.Success)
                PolicyCompanyId = resultGuids.Value;

            var result = GetFilterValue<string>("PolicyNumber");
            if (result.Success)
                PolicyNumber = result.Value;

            result = GetFilterValue<string>("PolicyClientLastName");
            if (result.Success)
                PolicyClientLastName = result.Value;

            var resultDateTime = GetFilterValue<DateTime>("StartDate");
            if (resultDateTime.Success)
                StartDate = resultDateTime.Value;

            resultDateTime = GetFilterValue<DateTime>("EndDate");
            if (resultDateTime.Success)
                EndDate = resultDateTime.Value;
        }

        public ScopeOptions Scope { get; set; }

        public Guid? CommissionStatementId { get; set; }
        public List<Guid> UserId { get; set; }
        public List<Guid> BranchId { get; set; }
        public List<Guid> CommissionTypeId { get; set; }
        public string PolicyNumber { get; set; }
        public string PolicyClientLastName { get; set; }
        public List<Guid> PolicyCompanyId { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }

    }
}