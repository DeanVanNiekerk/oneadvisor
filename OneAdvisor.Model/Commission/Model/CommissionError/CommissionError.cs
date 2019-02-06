using System;

namespace OneAdvisor.Model.Commission.Model.CommissionError
{
    public class CommissionError
    {
        public Guid Id { get; set; }
        public Guid CommissionStatementId { get; set; }
        public string PolicyNumber { get; set; }
        public string CommissionTypeCode { get; set; }

        public Guid? PolicyId { get; set; }
        public Guid? MemberId { get; set; }
        public Guid? CommissionTypeId { get; set; }
        public string Data { get; set; }
        public bool IsFormatValue { get; set; }

        public bool IsValid()
        {
            return PolicyId.HasValue && MemberId.HasValue && CommissionTypeId.HasValue;
        }
    }
}