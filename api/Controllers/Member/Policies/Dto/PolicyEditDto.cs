using System;
using System.Collections.Generic;
using api.App.Json;
using Newtonsoft.Json;

namespace api.Controllers.Member.Policies.Dto
{
    public class PolicyEditDto
    {
        public Guid? Id { get; set; }
        public Guid MemberId { get; set; }

        [JsonConverter(typeof(EmptyToDefaultConverter<Guid>))]
        public Guid CompanyId { get; set; }
        public string UserId { get; set; }
        public string Number { get; set; }
    }

}