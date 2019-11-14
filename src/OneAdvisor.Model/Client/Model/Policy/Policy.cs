using System;

namespace OneAdvisor.Model.Client.Model.Policy
{
    public class Policy
    {
        public Guid Id { get; set; }
        public Guid ClientId { get; set; }
        public Guid CompanyId { get; set; }
        public Guid UserId { get; set; }
        public string Number { get; set; }
        public DateTime? StartDate { get; set; }
        public decimal? Premium { get; set; }
        public Guid? PolicyTypeId { get; set; }
        public Guid? PolicyProductTypeId { get; set; }
        public Guid? PolicyProductId { get; set; }
        public bool IsActive { get; set; }

        public string ClientLastName { get; set; }
        public string ClientInitials { get; set; }
        public DateTime? ClientDateOfBirth { get; set; }
        public string CompanyName { get; set; }
    }
}