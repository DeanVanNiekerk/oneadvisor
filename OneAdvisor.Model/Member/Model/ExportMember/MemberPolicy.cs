using System;

namespace OneAdvisor.Model.Member.Model.ExportMember
{
    public class MemberPolicy
    {
        public string IdNumber { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string CellPhone { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public string TaxNumber { get; set; }

        public string PolicyNumber { get; set; }
        public string PolicyBroker { get; set; }
        public decimal? PolicyPremium { get; set; }
        public string PolicyTypeCode { get; set; }
        public DateTime? PolicyStartDate { get; set; }
        public string PolicyCompany { get; set; }
    }
}