using System;

namespace OneAdvisor.Model.Commission.Model.ImportCommission
{
    public class ImportCommission
    {
        public string PolicyNumber { get; set; }
        public string CommissionTypeCode { get; set; }
        public decimal AmountIncludingVAT { get; set; }
        public decimal VAT { get; set; }
        public DateTime? Date { get; set; }
    }
}