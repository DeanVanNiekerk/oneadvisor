using System;

namespace OneAdvisor.Model.Member.Model.MemberPolicy
{
    public class MemberPolicyEdit
    {
        public Guid? Id { get; set; }
        public Guid MemberId { get; set; }
        public Guid CompanyId { get; set; }
        public string UserId { get; set; }
        public string Number { get; set; }
    }
}