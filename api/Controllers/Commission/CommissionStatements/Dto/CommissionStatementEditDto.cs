using System;

namespace api.Controllers.Commission.CommissionStatements.Dto
{
    public class CommissionStatementEditDto
    {
        public Guid? Id { get; set; }
        public Guid? CompanyId { get; set; }
        public decimal? AmountIncludingVAT { get; set; }
        public decimal? VAT { get; set; }
        public DateTime? Date { get; set; }
        public bool? Processed { get; set; }
    }
}