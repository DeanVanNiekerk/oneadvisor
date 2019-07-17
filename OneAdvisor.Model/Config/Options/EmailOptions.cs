namespace OneAdvisor.Model.Config.Options
{
    public class EmailOptions
    {
        public string SendGridApiKey { get; set; }
        public string DefaultFromAddress { get; set; }
        public Emails Emails { get; set; }
    }

    public class Emails
    {
        public Email AlertUnknownCommissionTypes { get; set; }
    }

    public class Email
    {
        public string To { get; set; }
    }
}