using System;

namespace OneAdvisor.Model.Commission.Model.CommissionError
{
    public class CommissionErrorEdit
    {
        public Guid Id { get; set; }
        public Guid CommissionStatementId { get; set; }

        public Guid? PolicyId { get; set; }
        public Guid? ClientId { get; set; }
        public Guid? CommissionTypeId { get; set; }
        public OneAdvisor.Model.Commission.Model.ImportCommission.ImportCommission Data { get; set; }
        public bool IsFormatValid { get; set; }
    }
}