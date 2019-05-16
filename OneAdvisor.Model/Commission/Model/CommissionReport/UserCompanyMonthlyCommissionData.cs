using System;

namespace OneAdvisor.Model.Commission.Model.CommissionReport
{
    public class UserCompanyMonthlyCommissionData
    {
        public Guid CompanyId { get; set; }
        public decimal AmountExcludingVAT { get; set; }
    }
}