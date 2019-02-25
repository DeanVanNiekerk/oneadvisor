using System;

namespace OneAdvisor.Model.Directory.Model.Role
{
    public class Role
    {
        public const string SUPER_ADMINISTRATOR_ROLE = "super_administrator";

        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public Guid ApplicationId { get; set; }
    }
}