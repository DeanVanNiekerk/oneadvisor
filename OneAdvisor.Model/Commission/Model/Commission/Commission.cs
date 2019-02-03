using System;

namespace OneAdvisor.Model.Commission.Model.Commission
{
    public class Commission
    {
        public Guid Id { get; set; }
        public Guid CommissionStatementId { get; set; }
        public Guid PolicyId { get; set; }
        public Guid CommissionTypeId { get; set; }
        public decimal AmountIncludingVAT { get; set; }
        public decimal VAT { get; set; }

        public string UserId { get; set; }
    }
}