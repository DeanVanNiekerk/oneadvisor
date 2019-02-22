namespace OneAdvisor.Model.Directory.Model.Authentication
{
    public class JwtOptions
    {
        public string Key { get; set; }
        public string Issuer { get; set; }
        public string Audience { get; set; }
    }
}