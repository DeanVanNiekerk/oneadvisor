using System;

namespace api.Controllers.Directory.UserAliases.Dto
{
    public class UserAliasDto
    {
        public Guid? Id { get; set; }
        public string UserId { get; set; }
        public string Name { get; set; }
    }
}