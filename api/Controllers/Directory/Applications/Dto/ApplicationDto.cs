using System;
using api.App.Json;
using Newtonsoft.Json;

namespace api.Controllers.Directory.Applications.Dto
{
    public class ApplicationDto
    {
        [JsonConverter(typeof(EmptyToDefaultConverter<Guid>))]
        public Guid Id { get; set; }
        public string Name { get; set; }
    }
}