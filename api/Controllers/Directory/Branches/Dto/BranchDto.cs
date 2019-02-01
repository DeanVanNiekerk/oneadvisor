using System;
using Newtonsoft.Json;

namespace api.Controllers.Directory.Branches.Dto
{
    public class BranchDto
    {
        public Guid? Id { get; set; }
        public Guid? OrganisationId { get; set; }
        public string Name { get; set; }
    }
}