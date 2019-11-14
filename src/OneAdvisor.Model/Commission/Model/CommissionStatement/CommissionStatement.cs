using System;

namespace OneAdvisor.Model.Commission.Model.CommissionStatement
{
    public class CommissionStatement
    {
        public Guid Id { get; set; }
        public Guid CompanyId { get; set; }
        public decimal AmountIncludingVAT { get; set; }
        public decimal VAT { get; set; }
        public DateTime Date { get; set; }
        public bool Processed { get; set; }

        public int MappingErrorCount { get; set; }
        public int CommissionCount { get; set; }

        public decimal ActualAmountIncludingVAT { get; set; }
        public decimal ActualVAT { get; set; }

        public string CompanyName { get; set; }
    }
}