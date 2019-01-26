using System;
using System.Collections.Generic;
using api.App.Json;
using Newtonsoft.Json;

namespace api.Controllers.Directory.Roles.Dto
{
    public class RoleEditDto
    {
        public string Id { get; set; }
        public string Name { get; set; }
        [JsonConverter(typeof(EmptyToDefaultConverter<Guid>))]
        public Guid ApplicationId { get; set; }
        public IEnumerable<string> UseCaseIds { get; set; }
    }
}