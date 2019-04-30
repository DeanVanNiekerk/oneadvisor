using System;

namespace OneAdvisor.Model.Commission.Model.CommissionReport
{
    public class UserMonthlyCommissionData
    {
        public Guid UserId { get; set; }
        public string UserLastName { get; set; }
        public string UserFirstName { get; set; }
        public int Month { get; set; }
        public int Year { get; set; }

        public decimal MonthlyAnnuity { get; set; }
        public decimal AnnualAnnuity { get; set; }
        public decimal LifeFirstYears { get; set; }
        public decimal OnceOff { get; set; }
    }
}