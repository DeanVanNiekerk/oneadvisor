using System;

namespace api.Controllers.Directory.Roles.Dto
{
    public class RoleDto
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public Guid ApplicationId { get; set; }
    }
}