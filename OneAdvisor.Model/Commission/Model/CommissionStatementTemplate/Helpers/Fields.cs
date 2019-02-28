using System;
using System.Collections.Generic;
using OneAdvisor.Model.Commission.Model.CommissionStatementTemplate.Configuration;

namespace OneAdvisor.Model.Commission.Model.CommissionStatementTemplate.Helpers
{
    public class Fields
    {
        public static List<string> PrimaryFieldNames()
        {
            return new List<string>()
            {
                Enum.GetName(typeof(FieldNames), FieldNames.PolicyNumber),
                Enum.GetName(typeof(FieldNames), FieldNames.AmountExcludingVAT),
                Enum.GetName(typeof(FieldNames), FieldNames.AmountIncludingVAT),
                Enum.GetName(typeof(FieldNames), FieldNames.VAT)
            };
        }
    }
}