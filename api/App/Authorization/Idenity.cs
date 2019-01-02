using System;
using System.Collections.Generic;
using OneAdvisor.Model.Directory.Model.User;

namespace api.App.Authorization
{
    public class Identity
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public Guid BranchId { get; set; }
        public IEnumerable<string> RoleIds { get; set; }
        public Scope Scope { get; set; }
        public string AssistantToUserId { get; set; }

    }
}