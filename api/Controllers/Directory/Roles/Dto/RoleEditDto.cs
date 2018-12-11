using System;
using System.Collections.Generic;

namespace api.Controllers.Directory.Roles.Dto
{
    public class RoleEditDto
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public Guid ApplicationId { get; set; }
        public IEnumerable<string> UseCaseIds { get; set; }
    }
}