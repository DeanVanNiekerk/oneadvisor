using System;

namespace OneAdvisor.Model.Member.Model.Contact
{
    public class Contact
    {
        public Guid Id { get; set; }
        public Guid MemberId { get; set; }
        public Guid ContactTypeId { get; set; }
        public string Value { get; set; }
    }
}