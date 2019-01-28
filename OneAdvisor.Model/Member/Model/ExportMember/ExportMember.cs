using System;

namespace OneAdvisor.Model.Member.Model.ExportMember
{
    public class ExportMember
    {
        public string IdNumber { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }

        public int PolicyLifeInsuranceCount { get; set; }
        public int PolicyInvestmentCount { get; set; }
        public int PolicyMedicalCoverCount { get; set; }
        public int PolicyShortTermCount { get; set; }
    }
}