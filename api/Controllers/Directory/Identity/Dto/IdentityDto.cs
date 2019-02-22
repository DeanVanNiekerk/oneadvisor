using System;
using System.Collections.Generic;
using OneAdvisor.Model.Directory.Model.User;

namespace api.Controllers.Directory.Identity.Dto
{
    public class IdentityDto
    {
        public Guid Id { get; set; }
        public string UserName { get; set; }
        public Guid OrganisationId { get; set; }
        public string OrganisationName { get; set; }
        public Guid BranchId { get; set; }
        public string BranchName { get; set; }
        public IEnumerable<string> Roles { get; set; }
        public IEnumerable<string> UseCaseIds { get; set; }
        public Scope Scope { get; set; }
    }
}