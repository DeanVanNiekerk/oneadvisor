using System;

namespace api.Controllers.Member.Import.Dto
{
    public class ImportMemberDto
    {
        public string IdNumber { get; set; }

        public string FirstName { get; set; }
        public string LastName { get; set; }
        
        public string PolicyNumber { get; set; }
        public Guid? PolicyCompanyId { get; set; }
        public string PolicyUserFullName { get; set; }
    }
}