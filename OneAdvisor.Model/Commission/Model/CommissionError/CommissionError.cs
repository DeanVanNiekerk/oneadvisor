using System;

namespace OneAdvisor.Model.Commission.Model.CommissionError
{
    public class CommissionError
    {
        public Guid Id { get; set; }
        public Guid CommissionStatementId { get; set; }
        public int CommissionStatementMonth { get; set; }
        public int CommissionStatementYear { get; set; }

        public Guid? PolicyId { get; set; }
        public Guid? ClientId { get; set; }
        public Guid? CommissionTypeId { get; set; }
        public OneAdvisor.Model.Commission.Model.ImportCommission.ImportCommission Data { get; set; }
        public bool IsFormatValid { get; set; }

        public string PolicyTypeCode { get; set; }
    }
}