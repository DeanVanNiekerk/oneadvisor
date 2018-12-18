using System;
using System.Collections.Generic;

namespace api.App.Authorization
{
    public class Identity
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public Guid OrganisationId { get; set; }
        public IEnumerable<string> RoleIds { get; set; }
    }
}