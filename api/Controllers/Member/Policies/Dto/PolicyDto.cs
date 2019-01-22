using System;

namespace api.Controllers.Member.Policies.Dto
{
    public class PolicyDto
    {
        public Guid Id { get; set; }
        public Guid MemberId { get; set; }
        public Guid CompanyId { get; set; }
        public string UserId { get; set; }
        public string Number { get; set; }
        public DateTime? StartDate { get; set; }
        public decimal? Premium { get; set; }
    }
}