namespace OneAdvisor.Model.Directory.Model.Authentication
{
    public class JwtOptions
    {
        public string Secret { get; set; }
        public int LifeSpanDays { get; set; }
    }
}