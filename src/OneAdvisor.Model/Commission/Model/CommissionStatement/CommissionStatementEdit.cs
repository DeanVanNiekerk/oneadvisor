using System;

namespace OneAdvisor.Model.Commission.Model.CommissionStatement
{
    public class CommissionStatementEdit
    {
        public Guid? Id { get; set; }
        public Guid? CompanyId { get; set; }
        public decimal? AmountIncludingVAT { get; set; }
        public decimal? VAT { get; set; }
        public DateTime? Date { get; set; }
        public bool? Processed { get; set; }
        public string Notes { get; set; }
    }
}