namespace OneAdvisor.Model.Account.Model.Authentication
{
    public class JwtOptions
    {
        public string Secret { get; set; }
        public int LifeSpanDays { get; set; }
    }
}