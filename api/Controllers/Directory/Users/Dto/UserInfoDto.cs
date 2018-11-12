using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OneAdvisor.Model.Directory.Model.User;

namespace api.Controllers.Directory.Users.Dto
{
    public class UserInfoDto
    {
        public string Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public DateTime? LastLogin { get; set; }
        public DateTime? LastUpdated { get; set; }
        public DateTime? Activated { get; set; }
        public string Status { get; set; }
        public Guid OrganisationId { get; set; }
    }
}