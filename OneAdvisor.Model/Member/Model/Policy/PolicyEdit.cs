using System;

namespace OneAdvisor.Model.Member.Model.Policy
{
    public class PolicyEdit
    {
        public Guid? Id { get; set; }
        public Guid MemberId { get; set; }
        public Guid CompanyId { get; set; }
        public string UserId { get; set; }
        public string Number { get; set; }
    }
}