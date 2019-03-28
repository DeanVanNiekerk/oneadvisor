using System;

namespace OneAdvisor.Model.Client.Model.Client
{
    public class ClientPreview
    {
        public Guid Id { get; set; }
        public Guid ClientTypeId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string IdNumber { get; set; }
        public string AlternateIdNumber { get; set; }
        public DateTime? DateOfBirth { get; set; }

        public int PolicyCount { get; set; }
        public int ContactCount { get; set; }
    }
}