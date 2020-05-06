using System;
using System.Collections.Generic;

namespace OneAdvisor.Model.Directory.Model.Organisation.Configuration
{
    public class Config
    {
        public Config()
        {
            CompanyIds = new List<Guid>();
            Funds = new List<Fund>();
            LicenseCategoryIds = new List<Guid>();
            Address = new Address();
            ComplianceOfficer = new ComplianceOfficer();
            Branding = new Branding();
        }

        public bool VATRegistered { get; set; }
        public DateTime? VATRegistrationDate { get; set; }
        public List<Guid> CompanyIds { get; set; }
        public List<Fund> Funds { get; set; }
        public List<Guid> LicenseCategoryIds { get; set; }
        public string TelephoneNumber { get; set; }
        public Address Address { get; set; }
        public Branding Branding { get; set; }
        public ComplianceOfficer ComplianceOfficer { get; set; }
        public bool HasProfessionalIndemnityCover { get; set; }
        public bool HasSharesInProductProviders { get; set; } // Do you hold more than 10% shares in any one of the product providers ?
        public string HasSharesInProductProvidersTarget { get; set; } // if yes, who?
        public bool HasReceivedCommissionFromCompanies { get; set; } // Have you Received more than 30% of last years commission from the following companies
        public string HasReceivedCommissionFromCompaniesTarget { get; set; } // if yes, who?

    }
}