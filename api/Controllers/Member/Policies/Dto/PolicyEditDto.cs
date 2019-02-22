using System;
using System.Collections.Generic;

namespace api.Controllers.Member.Policies.Dto
{
    public class PolicyEditDto
    {
        public Guid? Id { get; set; }
        public Guid? MemberId { get; set; }
        public Guid? CompanyId { get; set; }
        public Guid UserId { get; set; }
        public string Number { get; set; }
        public DateTime? StartDate { get; set; }
        public decimal? Premium { get; set; }
        public Guid? PolicyTypeId { get; set; }
    }

}