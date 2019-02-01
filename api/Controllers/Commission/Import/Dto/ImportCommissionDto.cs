using System;

namespace api.Controllers.Commission.Import.Dto
{
    public class ImportCommissionDto
    {
        public string PolicyNumber { get; set; }
        public string CommissionTypeCode { get; set; }
        public decimal AmountIncludingVAT { get; set; }
        public decimal VAT { get; set; }
        public DateTime? Date { get; set; }
    }
}