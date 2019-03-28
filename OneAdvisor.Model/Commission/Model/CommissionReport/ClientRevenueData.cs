using System;

namespace OneAdvisor.Model.Commission.Model.CommissionReport
{
    public class ClientRevenueData
    {
        public int RowNumber { get; set; }
        public Guid ClientId { get; set; }
        public string ClientLastName { get; set; }
        public string ClientInitials { get; set; }
        public DateTime? ClientDateOfBirth { get; set; }

        public decimal MonthlyAnnuityMonth { get; set; }
        public decimal AnnualAnnuityAverage { get; set; }
        public decimal TotalMonthlyEarnings { get; set; }
        public decimal LifeFirstYears { get; set; }
        public decimal OnceOff { get; set; }
        public decimal GrandTotal { get; set; }
    }
}