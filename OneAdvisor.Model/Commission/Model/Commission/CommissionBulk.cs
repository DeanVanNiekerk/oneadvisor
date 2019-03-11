using System;

namespace OneAdvisor.Model.Commission.Model.Commission
{
    public class CommissionBulk
    {
        public Guid CommissionTypeId { get; set; }
        public decimal AmountIncludingVAT { get; set; }
        public decimal VAT { get; set; }
        public Guid UserId { get; set; }
        public DateTime Date { get; set; }
    }
}