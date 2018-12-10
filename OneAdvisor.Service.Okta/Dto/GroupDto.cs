namespace OneAdvisor.Service.Okta.Dto
{
    public class GroupDto
    {
        public const string TYPE_OKTA = "OKTA_GROUP";

        public string id { get; set; }
        public string type { get; set; }
        public GroupProfileDto profile { get; set; }
    }

    public class GroupProfileDto
    {
        public string name { get; set; }
        public string description { get; set; }
    }
}