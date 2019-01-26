using System;
using api.App.Json;
using Newtonsoft.Json;

namespace api.Controllers.Directory.Lookups.Dto
{
    public class CommissionTypeDto
    {
        [JsonConverter(typeof(EmptyToDefaultConverter<Guid>))]
        public Guid Id { get; set; }
        public string Name { get; set; }
    }
}