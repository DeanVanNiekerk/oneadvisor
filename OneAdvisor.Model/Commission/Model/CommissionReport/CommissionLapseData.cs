using System;

namespace OneAdvisor.Model.Commission.Model.CommissionReport
{
    public class CommissionLapseData
    {
        public Guid PolicyId { get; set; }
        public Guid ClientId { get; set; }
        public Guid CompanyId { get; set; }
        public Guid UserId { get; set; }
        public string Number { get; set; }
        public DateTime? StartDate { get; set; }
        public decimal? Premium { get; set; }
        public Guid? PolicyTypeId { get; set; }
        public bool IsActive { get; set; }

        public string ClientLastName { get; set; }
        public string ClientInitials { get; set; }
    }
}