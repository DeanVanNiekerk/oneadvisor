using System;

namespace OneAdvisor.Model.Commission.Model.CommissionError
{
    public class CommissionError
    {
        public Guid Id { get; set; }
        public Guid CommissionStatementId { get; set; }

        public Guid? PolicyId { get; set; }
        public Guid? MemberId { get; set; }
        public Guid? CommissionTypeId { get; set; }
        public OneAdvisor.Model.Commission.Model.ImportCommission.ImportCommission Data { get; set; }
        public bool IsFormatValid { get; set; }

        public bool IsValid()
        {
            return PolicyId.HasValue && MemberId.HasValue && CommissionTypeId.HasValue;
        }
    }
}