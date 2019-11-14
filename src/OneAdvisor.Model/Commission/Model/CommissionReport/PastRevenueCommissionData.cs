using System;

namespace OneAdvisor.Model.Commission.Model.CommissionReport
{
    public class PastRevenueCommissionData
    {
        public Guid CompanyId { get; set; }
        public Guid? PolicyTypeId { get; set; }
        public Guid CommissionEarningsTypeId { get; set; }
        public int DateYear { get; set; }
        public int DateMonth { get; set; }
        public decimal AmountExcludingVAT { get; set; }
    }
}