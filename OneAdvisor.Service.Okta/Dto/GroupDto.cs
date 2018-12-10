namespace OneAdvisor.Service.Okta.Dto
{
    public class GroupDto
    {
        public string id { get; set; }
        public GroupProfileDto profile { get; set; }
    }

    public class GroupProfileDto
    {
        public string name { get; set; }
        public string description { get; set; }
    }
}