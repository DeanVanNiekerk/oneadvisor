using System;
using api.App.Json;
using Newtonsoft.Json;

namespace api.Controllers.Directory.Organisations.Dto
{
    public class OrganisationDto
    {
        [JsonConverter(typeof(EmptyToDefaultConverter<Guid>))]
        public Guid Id { get; set; }
        public string Name { get; set; }
    }
}