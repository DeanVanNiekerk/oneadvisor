using System;

namespace OneAdvisor.Model.Commission.Model.CommissionReport
{
    public class UserEarningsTypeMonthlyCommissionData
    {
        public Guid CommissionEarningsTypeId { get; set; }
        public decimal AmountExcludingVAT { get; set; }
    }
}