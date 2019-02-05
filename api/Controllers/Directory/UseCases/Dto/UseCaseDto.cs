using System;

namespace api.Controllers.Directory.UseCases.Dto
{
    public class UseCaseDto
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public Guid? ApplicationId { get; set; }
    }
}