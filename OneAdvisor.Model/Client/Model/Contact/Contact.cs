using System;

namespace OneAdvisor.Model.Client.Model.Contact
{
    public class Contact
    {
        public Guid? Id { get; set; }
        public Guid? ClientId { get; set; }
        public Guid? ContactTypeId { get; set; }
        public string Value { get; set; }
    }
}