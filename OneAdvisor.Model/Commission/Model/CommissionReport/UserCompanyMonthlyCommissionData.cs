using System;

namespace OneAdvisor.Model.Commission.Model.CommissionReport
{
    public class UserCompanyMonthlyCommissionData
    {
        public Guid UserId { get; set; }
        public string UserLastName { get; set; }
        public string UserFirstName { get; set; }
        public int Month { get; set; }
        public int Year { get; set; }
        public Guid CompanyId { get; set; }
        public decimal AmountExcludingVAT { get; set; }
    }
}