using System;
using System.Text.Json.Serialization;

namespace OneAdvisor.Model.Commission.Model.ImportCommission
{
    public class ImportCommission
    {
        [JsonIgnore]
        public string Id { get; set; } //This Id is purely here for the unit tests (breaking if not here)


        //Bare minimum
        public string PolicyNumber { get; set; }
        public string AmountIncludingVAT { get; set; }
        public string VAT { get; set; }
        public string CommissionTypeCode { get; set; }

        //Optional Extras
        public string CommissionTypeValue { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Initials { get; set; }
        public string DateOfBirth { get; set; }
        public string IdNumber { get; set; }
        public string FullName { get; set; }
        public string BrokerFullName { get; set; }
        public string Currency { get; set; }
    }
}