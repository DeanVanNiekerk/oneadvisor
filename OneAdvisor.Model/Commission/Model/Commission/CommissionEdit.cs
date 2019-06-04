using System;

namespace OneAdvisor.Model.Commission.Model.Commission
{
    public class CommissionEdit
    {
        public Guid? Id { get; set; }
        public Guid? CommissionStatementId { get; set; }
        public Guid? PolicyId { get; set; }
        public Guid? CommissionTypeId { get; set; }
        public Guid? UserId { get; set; }
        public Guid? SplitGroupId { get; set; }

        public decimal? AmountIncludingVAT { get; set; }
        public decimal? VAT { get; set; }
        public OneAdvisor.Model.Commission.Model.ImportCommission.ImportCommission SourceData { get; set; }
    }
}