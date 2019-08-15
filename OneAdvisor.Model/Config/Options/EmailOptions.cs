namespace OneAdvisor.Model.Config.Options
{
    public class EmailOptions
    {
        public string SendGridApiKey { get; set; }
        public string DefaultFromAddress { get; set; }
        public string DefaultToAddress { get; set; }
        public Emails Emails { get; set; }
    }

    public class Emails
    {
        public Email CommissionImportAlerts { get; set; }
    }

    public class Email
    {
        public string To { get; set; }
    }
}