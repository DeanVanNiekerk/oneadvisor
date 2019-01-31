using System;

namespace api.Controllers.Commission.Commissions.Dto
{
    public class CommissionDto
    {
        public Guid Id { get; set; }
        public Guid PolicyId { get; set; }
        public Guid CommissionTypeId { get; set; }
        public decimal AmountIncludingVAT { get; set; }
        public decimal VAT { get; set; }
        public DateTime Date { get; set; }

        public string UserId { get; set; }
    }
}