using System;

namespace api.Controllers.Commission.CommissionError.Dto
{
    public class CommissionErrorDto
    {
        public Guid Id { get; set; }
        public Guid? CommissionStatementId { get; set; }
        public string PolicyNumber { get; set; }
        public string CommissionTypeCode { get; set; }

        public Guid? PolicyId { get; set; }
        public Guid? MemberId { get; set; }
        public Guid? CommissionTypeId { get; set; }
        public string Data { get; set; }
        public bool IsFormatValid { get; set; }
    }
}