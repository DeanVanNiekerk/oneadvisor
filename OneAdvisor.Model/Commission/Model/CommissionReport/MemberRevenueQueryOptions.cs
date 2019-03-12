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

            var resultString = GetFilterValue<string>("MemberLastName");
            if (resultString.Success)
                MemberLastName = resultString.Value;
        }

        public ScopeOptions Scope { get; set; }

        public int YearEnding { get; set; }
        public int MonthEnding { get; set; }
        public string MemberLastName { get; set; }
    }
}