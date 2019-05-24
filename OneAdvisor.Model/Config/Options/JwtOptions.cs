namespace OneAdvisor.Model.Config.Options
{
    public class JwtOptions
    {
        public string Secret { get; set; }
        public int LifeSpanDays { get; set; }
    }
}