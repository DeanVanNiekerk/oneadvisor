using System;

namespace OneAdvisor.Model.Commission.Model.CommissionReport
{
    public class MemberRevenueData
    {
        public int RowNumber { get; set; }
        public Guid MemberId { get; set; }
        public string MemberFirstName { get; set; }
        public string MemberLastName { get; set; }

        public decimal AnnualAnnuity { get; set; }
        public decimal AnnualAnnuityMonth { get; set; }

        public decimal MonthlyAnnuity { get; set; }
        public decimal MonthlyAnnuityMonth { get; set; }

        public decimal OnceOff { get; set; }
        public decimal OnceOffMonth { get; set; }

        public decimal LifeFirstYears { get; set; }
        public decimal LifeFirstYearsMonth { get; set; }
    }
}