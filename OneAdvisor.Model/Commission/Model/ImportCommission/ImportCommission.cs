using System;

namespace OneAdvisor.Model.Commission.Model.ImportCommission
{
    public class ImportCommission
    {
        public ImportCommission()
        {
            Id = Guid.NewGuid().ToString();
        }

        public string Id { get; set; }

        //Bare minimum
        public string PolicyNumber { get; set; }
        public string CommissionTypeCode { get; set; }
        public string AmountIncludingVAT { get; set; }
        public string VAT { get; set; }

        //Optional Extras
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Initials { get; set; }
        public string DateOfBirth { get; set; }
        public string IdNumber { get; set; }
    }
}