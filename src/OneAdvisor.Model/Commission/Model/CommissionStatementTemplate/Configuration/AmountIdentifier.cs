using System.Collections.Generic;

namespace OneAdvisor.Model.Commission.Model.CommissionStatementTemplate.Configuration
{
    public class AmountIdentifier : Identifier
    {
        public static string AmountIdentifierTypeIncludingVat = "includingVat";
        public static string AmountIdentifierTypeExcludingVat = "excludingVat";

        public string Type { get; set; }

        public static List<string> GetTypes()
        {
            return new List<string>()
            {
                AmountIdentifierTypeIncludingVat,
                AmountIdentifierTypeExcludingVat
            };
        }
    }
}