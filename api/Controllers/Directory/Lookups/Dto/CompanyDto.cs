using System;
using Newtonsoft.Json;

namespace api.Controllers.Directory.Lookups.Dto
{
    public class CompanyDto
    {
        public Guid? Id { get; set; }
        public string Name { get; set; }
    }
}