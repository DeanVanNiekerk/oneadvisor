namespace OneAdvisor.Model.Commission.Model.CommissionStatementTemplate.Configuration
{
    public enum FieldNames
    {
        PolicyNumber,
        AmountIncludingVAT,
        AmountExcludingVAT,
        Amount,
        VAT,
        FirstName,
        LastName,
        Initials,
        DateOfBirth,
        IdNumber,
        FullName,
        BrokerFullName,
        Currency,
    }

    public class Field
    {
        public string Name { get; set; }
        public string Column { get; set; }
        public bool AbsoluteValue { get; set; }
    }
}