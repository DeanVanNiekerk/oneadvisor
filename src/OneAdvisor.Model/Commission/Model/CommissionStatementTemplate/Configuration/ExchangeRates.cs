namespace OneAdvisor.Model.Commission.Model.CommissionStatementTemplate.Configuration
{
    public class ExchangeRates
    {
        public ExchangeRates()
        {
            HeaderIdentifier = new Identifier();
        }

        public Identifier HeaderIdentifier { get; set; }
        public string CurrencyColumn { get; set; }
        public string ExchangeRateColumn { get; set; }
    }
}