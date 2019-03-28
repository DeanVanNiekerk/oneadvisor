using System;

namespace OneAdvisor.Model.Client.Model.Policy
{
    public class PolicyEdit
    {
        public Guid? Id { get; set; }
        public Guid? ClientId { get; set; }
        public Guid? CompanyId { get; set; }
        public Guid? UserId { get; set; }
        public string Number { get; set; }
        public DateTime? StartDate { get; set; }
        public decimal? Premium { get; set; }
        public Guid? PolicyTypeId { get; set; }
    }
}