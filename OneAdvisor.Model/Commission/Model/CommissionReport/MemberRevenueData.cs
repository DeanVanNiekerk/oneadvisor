using System;

namespace OneAdvisor.Model.Commission.Model.CommissionReport
{
    public class MemberRevenueData
    {
        public int RowNumber { get; set; }
        public Guid MemberId { get; set; }
        public string MemberLastName { get; set; }
        public string MemberInitials { get; set; }
        public DateTime? MemberDateOfBirth { get; set; }

        public decimal MonthlyAnnuityMonth { get; set; }
        public decimal AnnualAnnuityAverage { get; set; }
        public decimal TotalMonthlyEarnings { get; set; }
        public decimal LifeFirstYears { get; set; }
        public decimal OnceOff { get; set; }
        public decimal GrandTotal { get; set; }
    }
}