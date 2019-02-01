using System;
using api.App.Json;
using Newtonsoft.Json;

namespace api.Controllers.Member.Contacts.Dto
{
    public class ContactDto
    {
        public Guid? Id { get; set; }
        public Guid? MemberId { get; set; }
        public Guid? ContactTypeId { get; set; }
        public string Value { get; set; }
    }
}