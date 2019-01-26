using System;
using api.App.Json;
using Newtonsoft.Json;

namespace api.Controllers.Directory.UseCases.Dto
{
    public class UseCaseDto
    {
        public string Id { get; set; }
        public string Name { get; set; }
        [JsonConverter(typeof(EmptyToDefaultConverter<Guid>))]
        public Guid ApplicationId { get; set; }
    }
}