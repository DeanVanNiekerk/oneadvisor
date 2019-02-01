using System;
using Newtonsoft.Json;

namespace api.Controllers.Directory.Applications.Dto
{
    public class ApplicationDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
    }
}