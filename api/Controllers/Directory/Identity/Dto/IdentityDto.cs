using System;
using System.Collections.Generic;

namespace api.Controllers.Directory.Identity.Dto
{
    public class IdentityDto
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public Guid OrganisationId { get; set; }
        public string OrganisationName { get; set; }
        public Guid BranchId { get; set; }
        public string BranchName { get; set; }
        public IEnumerable<string> RoleIds { get; set; }
        public IEnumerable<string> UseCaseIds { get; set; }
    }
}