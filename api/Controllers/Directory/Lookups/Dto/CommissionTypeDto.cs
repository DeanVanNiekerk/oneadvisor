using System;
using api.App.Json;
using Newtonsoft.Json;

namespace api.Controllers.Directory.Lookups.Dto
{
    public class CommissionTypeDto
    {
        public Guid? Id { get; set; }
        public Guid? PolicyTypeId { get; set; }
        public string Name { get; set; }
        public string Code { get; set; }
    }
}