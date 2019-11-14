using System;
using System.Collections.Generic;
using OneAdvisor.Model.Common;
using OneAdvisor.Model.Account.Model.Authentication;

namespace OneAdvisor.Model.Commission.Model.CommissionReport
{
    public class ClientRevenueQueryOptions : QueryOptionsBase<ClientRevenueData>
    {
        public ClientRevenueQueryOptions(ScopeOptions scope, string sortColumn, string sortDirection, int pageSize, int pageNumber, string filters = null)
        : base(sortColumn, sortDirection, pageSize, pageNumber, filters)
        {
            Scope = scope;

            BranchId = new List<Guid>();
            UserId = new List<Guid>();
            PolicyTypeId = new List<Guid>();

            //Defaults 
            var lastMonth = DateTime.UtcNow.AddMonths(-1);
            YearEnding = lastMonth.Year;
            MonthEnding = lastMonth.Month;

            var result = GetFilterValue<int>("YearEnding");
            if (result.Success)
                YearEnding = result.Value;

            result = GetFilterValue<int>("MonthEnding");
            if (result.Success)
                MonthEnding = result.Value;

            var resultString = GetFilterValue<string>("ClientLastName");
            if (resultString.Success)
                ClientLastName = resultString.Value;

            var resultGuids = GetFilterValues<Guid>("BranchId");
            if (resultGuids.Success)
                BranchId = resultGuids.Value;

            resultGuids = GetFilterValues<Guid>("UserId");
            if (resultGuids.Success)
                UserId = resultGuids.Value;

            resultGuids = GetFilterValues<Guid>("PolicyTypeId");
            if (resultGuids.Success)
                PolicyTypeId = resultGuids.Value;

            //Set start and end dates
            var date = new DateTime(YearEnding, MonthEnding, 1);
            EndDate = date.LastDayOfMonth();
            StartDate = EndDate.AddYears(-1);
        }

        public ScopeOptions Scope { get; set; }

        public int YearEnding { get; set; }
        public int MonthEnding { get; set; }
        public string ClientLastName { get; set; }
        public List<Guid> BranchId { get; set; }
        public List<Guid> UserId { get; set; }
        public List<Guid> PolicyTypeId { get; set; }

        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
    }
}