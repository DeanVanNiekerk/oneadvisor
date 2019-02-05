using System;

namespace OneAdvisor.Model.Commission.Model.ImportCommission
{
    public class ImportCommission
    {
        public string PolicyNumber { get; set; }
        public string CommissionTypeCode { get; set; }
        public string AmountIncludingVAT { get; set; }
        public string VAT { get; set; }
    }
}