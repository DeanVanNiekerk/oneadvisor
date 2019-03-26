using System;

namespace OneAdvisor.Model.Client.Model.Client
{
    public class Client
    {
        public Guid Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string MaidenName { get; set; }
        public string Initials { get; set; }
        public string PreferredName { get; set; }
        public string IdNumber { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public string PassportNumber { get; set; }
        public string TaxNumber { get; set; }
        public Guid? MarritalStatusId { get; set; }
        public DateTime? MarriageDate { get; set; }
    }
}