using System;

namespace OneAdvisor.Model.Commission.Model.Commission
{
    public class Commission
    {
        public Guid Id { get; set; }
        public Guid CommissionStatementId { get; set; }
        public Guid PolicyId { get; set; }
        public Guid CommissionTypeId { get; set; }
        public decimal AmountIncludingVAT { get; set; }
        public decimal VAT { get; set; }
        public Guid UserId { get; set; }
        public Guid? SplitGroupId { get; set; }

        public string PolicyNumber { get; set; }

        public DateTime CommissionStatementDate { get; set; }
        public Guid PolicyCompanyId { get; set; }
        public string PolicyClientLastName { get; set; }
        public string PolicyClientInitials { get; set; }
        public DateTime? PolicyClientDateOfBirth { get; set; }
    }
}