using System;

namespace OneAdvisor.Model.Commission.Model.CommissionSplitRule
{
    public class CommissionSplit
    {
        public Guid UserId { get; set; }
        public decimal Percentage { get; set; }
    }
}