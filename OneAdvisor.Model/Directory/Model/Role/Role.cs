using System;

namespace OneAdvisor.Model.Directory.Model.Role
{
    public class Role
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public Guid ApplicationId { get; set; }
    }
}