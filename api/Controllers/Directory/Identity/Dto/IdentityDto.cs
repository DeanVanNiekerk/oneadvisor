using System;
using System.Collections.Generic;
using OneAdvisor.Model.Directory.Model.User;

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
        public string Scope { get; set; }
        public string AssistantToUserId { get; set; }
    }
}