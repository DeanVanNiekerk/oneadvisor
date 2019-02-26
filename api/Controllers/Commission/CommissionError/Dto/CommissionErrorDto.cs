using System;
using OneAdvisor.Model.Commission.Model.ImportCommission;

namespace api.Controllers.Commission.CommissionError.Dto
{
    public class CommissionErrorDto
    {
        public Guid Id { get; set; }
        public Guid? CommissionStatementId { get; set; }

        public Guid? PolicyId { get; set; }
        public Guid? MemberId { get; set; }
        public Guid? CommissionTypeId { get; set; }
        public ImportCommission Data { get; set; }
        public bool IsFormatValid { get; set; }
    }
}