using System;

namespace OneAdvisor.Model.Member.Model.ImportMember
{
    public class ImportMember
    {
        public string IdNumber { get; set; }

        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string TaxNumber { get; set; }
        public DateTime? DateOfBirth { get; set; }

        public string PolicyNumber { get; set; }
        public Guid? PolicyCompanyId { get; set; }
        public string PolicyUserFullName { get; set; }
        public decimal? PolicyPremium { get; set; }
        public string PolicyType { get; set; }
        public DateTime? PolicyStartDate { get; set; }

    }
}