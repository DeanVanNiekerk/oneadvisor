using System;

namespace OneAdvisor.Model.Directory.Model.Role
{
    public class Role
    {
        public static readonly string SUPER_ADMINISTRATOR_ROLE = "super_administrator";

        public string Id { get; set; }
        public string Name { get; set; }
        public Guid ApplicationId { get; set; }
    }
}