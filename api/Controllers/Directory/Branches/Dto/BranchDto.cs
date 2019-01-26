using System;
using api.App.Json;
using Newtonsoft.Json;

namespace api.Controllers.Directory.Branches.Dto
{
    public class BranchDto
    {
        [JsonConverter(typeof(EmptyToDefaultConverter<Guid>))]
        public Guid Id { get; set; }
        [JsonConverter(typeof(EmptyToDefaultConverter<Guid>))]
        public Guid OrganisationId { get; set; }
        public string Name { get; set; }
    }
}