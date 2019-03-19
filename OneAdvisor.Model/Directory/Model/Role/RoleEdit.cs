using System;
using System.Collections.Generic;

namespace OneAdvisor.Model.Directory.Model.Role
{
    public class RoleEdit
    {
        public Guid? Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public Guid? ApplicationId { get; set; }
        public IEnumerable<string> UseCaseIds { get; set; }
    }
}