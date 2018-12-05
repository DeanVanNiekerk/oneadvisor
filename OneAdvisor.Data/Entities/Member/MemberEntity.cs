using System;

namespace OneAdvisor.Data.Entities.Member
{
    public class MemberEntity
    {
        public Guid Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
    }
}