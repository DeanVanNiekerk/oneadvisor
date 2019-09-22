using System;
using System.Collections.Generic;
using OneAdvisor.Model.Common;
using OneAdvisor.Model.Account.Model.Authentication;

namespace OneAdvisor.Model.Commission.Model.CommissionReport
{
    public class CommissionLapseQueryOptions : QueryOptionsBase<CommissionLapseData>
    {
        public CommissionLapseQueryOptions(ScopeOptions scope, string sortColumn, string sortDirection, int pageSize, int pageNumber, string filters = null)
        : base(string.IsNullOrEmpty(sortColumn) ? "Number" : sortColumn, sortDirection, pageSize, pageNumber, filters)
        {
            Scope = scope;

            Date = DateTime.UtcNow;

            UserId = new List<Guid>();
            CompanyId = new List<Guid>();
            PolicyTypeId = new List<Guid>();

            var result = GetFilterValue<string>("Number");
            if (result.Success)
                Number = result.Value;

            result = GetFilterValue<string>("ClientLastName");
            if (result.Success)
                ClientLastName = result.Value;

            var resultDateTime = GetFilterValue<DateTime>("Date");
            if (resultDateTime.Success)
                Date = resultDateTime.Value;

            var resultsGuid = GetFilterValues<Guid>("UserId");
            if (resultsGuid.Success)
                UserId = resultsGuid.Value;

            resultsGuid = GetFilterValues<Guid>("CompanyId");
            if (resultsGuid.Success)
                CompanyId = resultsGuid.Value;

            resultsGuid = GetFilterValues<Guid>("PolicyTypeId");
            if (resultsGuid.Success)
                PolicyTypeId = resultsGuid.Value;

            var resultBool = GetFilterValue<bool>("IsActive");
            if (resultBool.Success)
                IsActive = resultBool.Value;
        }

        public ScopeOptions Scope { get; set; }

        public List<Guid> UserId { get; set; }
        public List<Guid> CompanyId { get; set; }
        public List<Guid> PolicyTypeId { get; set; }
        public DateTime Date { get; set; }
        public string Number { get; set; }
        public string ClientLastName { get; set; }
        public bool? IsActive { get; set; }
    }
}