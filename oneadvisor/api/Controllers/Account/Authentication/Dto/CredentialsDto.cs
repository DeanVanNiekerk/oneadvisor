using System;

namespace api.Controllers.Account.Authentication.Dto
{
    public class CredentialsDto
    {
        public string UserName { get; set; }
        public string Password { get; set; }
        public Guid? OrganisationId { get; set; }
    }

}